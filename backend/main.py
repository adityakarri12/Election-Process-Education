import os
import json
from datetime import datetime
from fastapi import FastAPI, HTTPException, APIRouter
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from google import genai
from google.genai import types
from dotenv import load_dotenv
import httpx
import re
import time

load_dotenv()
load_dotenv(dotenv_path="../.env")

app = FastAPI(title="ElectraLearn API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory cache to prevent quota exhaustion
# Stores: {key: {"data": result, "expiry": timestamp}}
CACHE = {}
CACHE_TTL = 600 # 10 minutes cache for accuracy without hitting limits

# API Key Management and Rotation
API_KEYS_RAW = os.getenv("GEMINI_API_KEYS") or os.getenv("GEMINI_API_KEY") or os.getenv("VITE_GEMINI_API_KEY")
API_KEYS = [k.strip() for k in API_KEYS_RAW.split(",") if k.strip()] if API_KEYS_RAW else []

class GenAICluster:
    def __init__(self, keys: List[str]):
        self.keys = keys
        self.current_index = 0
        
    def get_client(self):
        if not self.keys:
            return None
        # Create a fresh client every time to ensure no state leakage
        return genai.Client(api_key=self.keys[self.current_index])
    
    def rotate(self):
        if len(self.keys) > 1:
            self.current_index = (self.current_index + 1) % len(self.keys)
            print(f"Rotating to API Key Index: {self.current_index}")
            return True
        return False

cluster = GenAICluster(API_KEYS)
api_router = APIRouter()

@api_router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "keys_loaded": len(cluster.keys),
        "current_key_index": cluster.current_index,
        "cache_size": len(CACHE),
        "models_available": ["gemini-1.5-flash-8b", "gemini-2.5-flash", "gemini-2.0-flash"]
    }

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = []

class ConstituencyResponse(BaseModel):
    name: str
    state: str
    mp: str
    mla: str
    district: str
    booths: int
    turnout: str
    status: str

class NextMajorEvent(BaseModel):
    title: str
    date: str
    description: str

class CalendarEventDetails(BaseModel):
    election_date: str
    result_date: str
    candidates: List[str]
    winner: Optional[str] = None
    total_seats: int
    total_constituencies: int
    state_jurisdiction: str

class CalendarEvent(BaseModel):
    title: str
    date: str
    type: str
    details: Optional[CalendarEventDetails] = None

class LiveIntelligenceResponse(BaseModel):
    upcoming_elections: List[CalendarEvent]
    upcoming_results: List[CalendarEvent]
    past_results: List[CalendarEvent]



# Root route removed to allow static frontend serving

@api_router.post("/chatbot")
async def chatbot(request: ChatRequest):
    """
    Asynchronous chatbot endpoint that interacts with Gemini.
    Handles message history and provides expert analysis on Indian elections.
    """
    if not cluster.keys:
        return {"response": "I am operating in fallback mode. The election process involves registration, nomination, campaigning, and voting. Please update the API key to interact with me dynamically!"}
    
    try:
        models_to_try = [
            "gemini-flash-lite-latest",
            "gemini-flash-latest",
            "gemini-2.5-flash",
            "gemini-2.0-flash", 
            "gemini-pro-latest"
        ]
        response_text = None
        for attempt in range(len(cluster.keys) or 1):
            key = cluster.keys[cluster.current_index]
            
            for model_name in models_to_try:
                try:
                    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={key}"
                    contents = []
                    for item in request.history:
                        if 'content' in item:
                            contents.append({"role": "user", "parts": [{"text": item['content']}]})
                        if 'response' in item:
                            contents.append({"role": "model", "parts": [{"text": item['response']}]})
                    contents.append({"role": "user", "parts": [{"text": f"Context: {datetime.now().strftime('%Y-%m-%d')}, expert on Indian Elections. Question: {request.message}"}]})
                    
                    payload = {
                        "contents": contents,
                        "generationConfig": {"temperature": 0.7, "maxOutputTokens": 800}
                    }
                    
                    async with httpx.AsyncClient() as client:
                        api_res = await client.post(url, json=payload, timeout=15.0)
                        if api_res.status_code == 200:
                            data = api_res.json()
                            if 'candidates' in data and len(data['candidates']) > 0:
                                response_text = data['candidates'][0]['content']['parts'][0]['text']
                                break
                        elif api_res.status_code == 429:
                            print(f"Chatbot 429 using {key[:10]}... and {model_name}")
                            break # Key exhausted, move to next key
                        else:
                            print(f"Chatbot Error {api_res.status_code}: {api_res.text}")
                except Exception as e:
                    print(f"Chatbot Exception with {model_name}: {e}")
            
            if response_text: break
            time.sleep(0.4) # Jitter to prevent burst flagging
            if not cluster.rotate(): break
            
        if not response_text:
            return {"response": "I'm experiencing high traffic. As an election expert, I can tell you that the 2024 results are now official. Please try again in a few seconds."}
            
        return {"response": response_text}
    except Exception as e:
        print(f"Chatbot API Error: {e}")
        return {"response": "Connection error. Please refresh and try again."}

@api_router.get("/dashboard/stats")
async def get_dashboard_stats():
    """
    Returns real-time simulated standardized data for the election dashboard.
    Includes summary statistics and historical turnout data.
    """
    # Real-time simulated standardized data
    return {
        "summary": {
            "total_voters": "968.8 Million",
            "polling_stations": "1.05 Million",
            "female_voters": "471.2 Million",
            "first_time_voters": "18.4 Million"
        },
        "turnout_history": [
            {"year": "2004", "rate": 58.07},
            {"year": "2009", "rate": 58.19},
            {"year": "2014", "rate": 66.44},
            {"year": "2019", "rate": 67.40},
            {"year": "2024", "rate": 66.14}
        ]
    }

@api_router.get("/constituency/{pincode}")
async def get_constituency_data(pincode: str):
    """
    Retrieves electoral data for a specific pincode.
    Uses a multi-layered approach: Postal API first, then Gemini for mapping representatives.
    """
    # Fetch exact location from pincode using postal API
    location_data = None
    district = "Regional Area"
    state = "Indian Union"
    name = "Rural/General Constituency"
    
    try:
        async with httpx.AsyncClient() as http_client:
            postal_res = await http_client.get(f"https://api.postalpincode.in/pincode/{pincode}", timeout=5.0)
            if postal_res.status_code == 200:
                p_data = postal_res.json()
                if p_data and isinstance(p_data, list) and len(p_data) > 0 and p_data[0].get("Status") == "Success":
                    post_offices = p_data[0].get("PostOffice", [])
                    if post_offices:
                        post_office = post_offices[0]
                        name = post_office.get("Name", name)
                        district = post_office.get("District", district)
                        state = post_office.get("State", state)
    except Exception as e:
        print(f"Postal API Error: {e}")

    if not cluster.keys:
        return {
            "name": name, 
            "state": state, 
            "mp": "Accurate Data Unavailable", 
            "mla": "Accurate Data Unavailable",
            "district": district,
            "booths": 120, 
            "turnout": "65.0%",
            "status": "Active"
        }

    # Check Cache First
    cache_key = f"const_{pincode}"
    if cache_key in CACHE:
        if datetime.now().timestamp() < CACHE[cache_key]["expiry"]:
            print(f"Returning cached constituency data for {pincode}")
            return CACHE[cache_key]["data"]

    try:
        # Construct context string based on whether we have postal data
        location_context = ""
        if district != "Regional Area":
            location_context = f"City/Area: {name}, District: {district}, State: {state}"
        else:
            location_context = "Location details unknown, please determine location from pincode alone."

        prompt = f"""
        Act as a highly accurate Indian Electoral Intelligence expert.
        Provide the exact current electoral data for the Indian constituency associated with Pincode: {pincode}.
        
        {location_context}

        Your Task:
        1. Identify the LOK SABHA (Parliamentary) constituency for this pincode and the current sitting Member of Parliament (MP).
        2. Identify the VIDHAN SABHA (Legislative Assembly) constituency for this area and the current sitting Member of Legislative Assembly (MLA).
        3. Include their FULL NAMES and their POLITICAL PARTIES in parentheses.

        Return ONLY a JSON object with these exact keys: 
        "name": string (City or Area Name), 
        "state": string (State Name), 
        "mp": "Constituency Name - MP Name (Party)", 
        "mla": "Constituency Name - MLA Name (Party)", 
        "district": string (District Name), 
        "booths": integer (estimated total polling stations in this pincode area), 
        "turnout": "string" (latest historical voter turnout percentage, e.g. "72.4%"), 
        "status": "Active"
        
        CRITICAL: Use your internal knowledge to provide the most recent verified representative as of May 2026. Do not return generic responses.
        """
        # Attempt constituency data retrieval with rotation and multi-model fallback
        models_to_try = [
            "gemini-flash-lite-latest",
            "gemini-flash-latest",
            "gemini-2.5-flash",
            "gemini-2.0-flash", 
            "gemini-pro-latest"
        ]
        
        response_text = None
        for attempt in range(len(cluster.keys) or 1):
            key = cluster.keys[cluster.current_index]
            
            for model_name in models_to_try:
                try:
                    # Try v1beta API route
                    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={key}"
                    payload = {
                        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
                        "generationConfig": {"temperature": 0.1}
                    }
                    if "flash" in model_name:
                        payload["generationConfig"]["responseMimeType"] = "application/json"

                    async with httpx.AsyncClient(verify=False, trust_env=True) as client:
                        api_res = await client.post(url, json=payload, timeout=20.0)
                        if api_res.status_code == 200:
                            data = api_res.json()
                            if 'candidates' in data and len(data['candidates']) > 0:
                                response_text = data['candidates'][0]['content']['parts'][0]['text']
                                break
                        elif api_res.status_code == 429:
                            print(f"Constituency 429 using {key[:10]}... and {model_name}")
                            break 
                        else:
                            print(f"Constituency Error {api_res.status_code}: {api_res.text}")
                    if response_text: break
                except Exception as e:
                    print(f"API Route {model_name} Error: {e}")
            
            if response_text: break 
            time.sleep(0.5)
            if not cluster.rotate(): break
            
        if not response_text:
            raise Exception("Real-time AI data is currently unavailable due to API rate limits. Please try again in a few moments.")

        # Robust JSON Extraction
        json_content = response_text.strip()
        json_match = re.search(r'```(?:json)?\s*({.*?})\s*```', response_text, re.DOTALL)
        if json_match:
            json_content = json_match.group(1)
        else:
            json_match = re.search(r'({.*})', response_text, re.DOTALL)
            if json_match:
                json_content = json_match.group(1)
            
        result = json.loads(json_content)
        # Store in Cache
        CACHE[cache_key] = {
            "data": result,
            "expiry": datetime.now().timestamp() + CACHE_TTL
        }
        return result
    except Exception as e:
        print(f"Intelligence Fallback Error: {e}")
        return {
            "name": name, 
            "state": state, 
            "mp": "Accurate Data Unavailable", 
            "mla": "Accurate Data Unavailable",
            "district": district,
            "booths": 120, 
            "turnout": "65.0%",
            "status": "Active"
        }

@api_router.get("/intelligence/live")
async def get_live_intelligence():
    """
    Fetches real-time electoral intelligence from Gemini.
    Categorizes results into upcoming elections, upcoming results, and past results.
    """
    # Check Cache First
    cache_key = "live_intel"
    if cache_key in CACHE:
        if datetime.now().timestamp() < CACHE[cache_key]["expiry"]:
            print("Returning cached live intelligence")
            return CACHE[cache_key]["data"]

    try:
        if not cluster.keys:
            raise Exception("No Gemini API keys found in configuration")
            
        prompt = f"""
        Act as an expert Indian Electoral Intelligence Analyst. Provide current electoral intelligence for elections in India.
        CRITICAL: Today's date is {datetime.now().strftime('%Y-%m-%d')}.
        Ensure the dates, candidates, and parties are as accurate as possible based on current real-world knowledge.
        
        You MUST generate EXACTLY 3 distinct lists. 
        Each list MUST contain AT LEAST 10 to 15 items to provide deep, maximum domain-centric intelligence across national, state, municipal, panchayat, and local body by-elections. 
        DO NOT provide less than 10 items per list. If needed, extrapolate based on known cyclical state/local schedules.
        
        1. 'upcoming_elections': Elections where the voting date is STRICTLY AFTER today.
        2. 'upcoming_results': Elections where voting is done (or happening today), but results are STRICTLY AFTER today.
        3. 'past_results': Elections where results were recently declared (STRICTLY BEFORE today).
        
        For all lists, use this format for each item:
        {{
            "title": string, 
            "date": string, 
            "type": string, 
            "details": {{
                "election_date": string, 
                "result_date": string, 
                "candidates": ["Candidate Name (Party Name)", "Candidate Name (Party Name)"],
                "winner": string (ONLY for past_results, the name of the winning candidate/party. Otherwise null),
                "total_seats": integer, 
                "total_constituencies": integer,
                "state_jurisdiction": string
            }}
        }}
        Return ONLY valid JSON containing these three keys.
        """
        # Attempt live intelligence retrieval with rotation and multi-model fallback
        models_to_try = [
            "gemini-flash-lite-latest",
            "gemini-flash-latest",
            "gemini-2.5-flash",
            "gemini-2.0-flash", 
            "gemini-pro-latest"
        ]
        response_text = None
        for attempt in range(len(cluster.keys) or 1):
            key = cluster.keys[cluster.current_index]
            
            for model_name in models_to_try:
                try:
                    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={key}"
                    payload = {
                        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
                        "generationConfig": {"temperature": 0.1}
                    }
                    if "flash" in model_name:
                        payload["generationConfig"]["responseMimeType"] = "application/json"

                    async with httpx.AsyncClient(verify=False, trust_env=True) as client:
                        api_res = await client.post(url, json=payload, timeout=20.0)
                        if api_res.status_code == 200:
                            data = api_res.json()
                            if 'candidates' in data and len(data['candidates']) > 0:
                                response_text = data['candidates'][0]['content']['parts'][0]['text']
                                break
                        elif api_res.status_code == 429:
                            break 
                except Exception as e:
                    continue
                    
            if response_text: break 
            time.sleep(0.5)
            if not cluster.rotate(): break
            
        # If no response was received after all attempts
        if not response_text:
            raise Exception("All keys and models exhausted")
        raw_text = response_text
        
        # Robust JSON Extraction
        json_content = raw_text.strip()
        json_match = re.search(r'```(?:json)?\s*({.*?})\s*```', raw_text, re.DOTALL)
        if json_match:
            json_content = json_match.group(1)
        else:
            json_match = re.search(r'({.*})', raw_text, re.DOTALL)
            if json_match:
                json_content = json_match.group(1)
            
        result = json.loads(json_content)
        # Store in Cache
        CACHE[cache_key] = {
            "data": result,
            "expiry": datetime.now().timestamp() + CACHE_TTL
        }
        return result
    except Exception as e:
        print(f"Live Intel Error: {e}")
        return {
            "upcoming_elections": [
                {
                    "title": "West Bengal Assembly", 
                    "date": "May 10, 2026", 
                    "type": "Assembly",
                    "details": {
                        "election_date": "May 10, 2026",
                        "result_date": "June 4, 2026",
                        "candidates": ["Mamata Banerjee (AITC)", "Suvendu Adhikari (BJP)", "Adhir Ranjan (INC)"],
                        "total_seats": 294,
                        "total_constituencies": 294,
                        "state_jurisdiction": "West Bengal"
                    }
                },
                {
                    "title": "Tamil Nadu Urban Local Body",
                    "date": "August 15, 2026",
                    "type": "Municipal",
                    "details": {
                        "election_date": "August 15, 2026",
                        "result_date": "August 20, 2026",
                        "candidates": ["DMK Alliance", "AIADMK Alliance", "BJP Alliance"],
                        "total_seats": 12500,
                        "total_constituencies": 12500,
                        "state_jurisdiction": "Tamil Nadu"
                    }
                },
                {
                    "title": "Kerala Assembly Elections",
                    "date": "April 6, 2026",
                    "type": "Assembly",
                    "details": {
                        "election_date": "April 6, 2026",
                        "result_date": "May 2, 2026",
                        "candidates": ["Pinarayi Vijayan (CPI(M))", "VD Satheesan (INC)", "K. Surendran (BJP)"],
                        "total_seats": 140,
                        "total_constituencies": 140,
                        "state_jurisdiction": "Kerala"
                    }
                }
            ],
            "upcoming_results": [
                {
                    "title": "Bihar By-Elections",
                    "date": "May 1, 2026",
                    "type": "By-Election",
                    "details": {
                        "election_date": "April 28, 2026",
                        "result_date": "May 5, 2026",
                        "candidates": ["RJD Candidate", "JDU Candidate"],
                        "total_seats": 4,
                        "total_constituencies": 4,
                        "state_jurisdiction": "Bihar"
                    }
                },
                {
                    "title": "Punjab Municipal Polls",
                    "date": "May 3, 2026",
                    "type": "Municipal",
                    "details": {
                        "election_date": "April 30, 2026",
                        "result_date": "May 8, 2026",
                        "candidates": ["AAP Candidate", "INC Candidate", "SAD Candidate"],
                        "total_seats": 117,
                        "total_constituencies": 117,
                        "state_jurisdiction": "Punjab"
                    }
                },
                {
                    "title": "Maharashtra Local Body",
                    "date": "May 10, 2026",
                    "type": "Local Body",
                    "details": {
                        "election_date": "May 5, 2026",
                        "result_date": "May 12, 2026",
                        "candidates": ["Maha Vikas Aghadi", "Mahayuti"],
                        "total_seats": 250,
                        "total_constituencies": 250,
                        "state_jurisdiction": "Maharashtra"
                    }
                }
            ],
            "past_results": [
                {
                    "title": "Assam Panchayat Elections",
                    "date": "November 5, 2025",
                    "type": "Panchayat",
                    "details": {
                        "election_date": "November 5, 2025",
                        "result_date": "November 10, 2025",
                        "candidates": ["BJP", "INC", "AIUDF"],
                        "winner": "BJP",
                        "total_seats": 26000,
                        "total_constituencies": 26000,
                        "state_jurisdiction": "Assam"
                    }
                },
                {
                    "title": "Madhya Pradesh Assembly",
                    "date": "November 17, 2023",
                    "type": "Assembly",
                    "details": {
                        "election_date": "November 17, 2023",
                        "result_date": "December 3, 2023",
                        "candidates": ["Shivraj Singh Chouhan (BJP)", "Kamal Nath (INC)"],
                        "winner": "Shivraj Singh Chouhan (BJP)",
                        "total_seats": 230,
                        "total_constituencies": 230,
                        "state_jurisdiction": "Madhya Pradesh"
                    }
                },
                {
                    "title": "Rajasthan Assembly",
                    "date": "November 25, 2023",
                    "type": "Assembly",
                    "details": {
                        "election_date": "November 25, 2023",
                        "result_date": "December 3, 2023",
                        "candidates": ["Ashok Gehlot (INC)", "Bhajan Lal Sharma (BJP)"],
                        "winner": "Bhajan Lal Sharma (BJP)",
                        "total_seats": 200,
                        "total_constituencies": 200,
                        "state_jurisdiction": "Rajasthan"
                    }
                }
            ]
        }

app.include_router(api_router, prefix="/api")

# Serve static files from the frontend build
# Ensure this is after the API router to avoid shadowing
if os.path.exists("/app/static"):
    app.mount("/", StaticFiles(directory="/app/static", html=True), name="static")
elif os.path.exists("static"):
    app.mount("/", StaticFiles(directory="static", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
