import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from google import genai
from google.genai import types
from dotenv import load_dotenv

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

API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("VITE_GEMINI_API_KEY")
client = genai.Client(api_key=API_KEY)

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = []

@app.get("/")
async def root():
    return {"message": "Welcome to ElectraLearn API"}

@app.post("/api/chatbot")
async def chatbot(request: ChatRequest):
    if not API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key is missing.")
    
    try:
        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=request.message,
            config=types.GenerateContentConfig(
                system_instruction="You are Electra AI, an expert on election processes. Be professional and educational."
            )
        )
        return {"response": response.text}
    except Exception as e:
        print(f"API Error: {e}")
        fallback_msg = "I'm currently receiving a high volume of queries. To answer briefly: The election process involves registration, nomination, campaigning, and voting. For more specific details, please check our Learn and Simulation tabs while my central link stabilizes!"
        return {"response": fallback_msg}

@app.get("/api/dashboard/stats")
async def get_dashboard_stats():
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

@app.get("/api/constituency/{pincode}")
async def get_constituency_data(pincode: str):
    # Standardized Metropolitan Electoral Data (Elite Cache)
    elite_data = {
        "500001": {"name": "Hyderabad", "state": "Telangana", "mp": "Asaduddin Owaisi", "mla": "Mir Zulfiqar Ali", "district": "Hyderabad Central", "booths": 142, "turnout": "44.8%", "status": "Active"},
        "110001": {"name": "New Delhi", "state": "Delhi", "mp": "Bansuri Swaraj", "mla": "Shiv Charan Goel", "district": "Central Delhi", "booths": 98, "turnout": "58.2%", "status": "Completed"},
        "400001": {"name": "Mumbai South", "state": "Maharashtra", "mp": "Arvind Sawant", "mla": "Rahul Narwekar", "district": "Mumbai City", "booths": 120, "turnout": "52.1%", "status": "Completed"},
        "600001": {"name": "Chennai North", "state": "Tamil Nadu", "mp": "Dr. Kalanidhi Veeraswamy", "mla": "P.K. Sekar Babu", "district": "Chennai", "booths": 156, "turnout": "60.1%", "status": "Completed"},
        "700001": {"name": "Kolkata Uttar", "state": "West Bengal", "mp": "Sudip Bandyopadhyay", "mla": "Nayana Bandyopadhyay", "district": "Kolkata", "booths": 188, "turnout": "63.4%", "status": "Active"}
    }
    
    if pincode in elite_data:
        return elite_data[pincode]

    # Universal Intelligence Fallback (Gemini Powered)
    try:
        prompt = f"""
        Provide electoral data for the Indian pincode: {pincode}.
        Return ONLY a JSON object with these keys: 
        name (City/Area), state, mp (Current Member of Parliament), mla (Current MLA), district, booths (approx number), turnout (typical percentage), status (Active/Completed).
        Ensure the data is as accurate as possible for the current 2024-2026 cycle.
        """
        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        import json
        intel = json.loads(response.text)
        return intel
    except Exception as e:
        print(f"Intelligence Fallback Error: {e}")
        return {
            "name": "Rural/General Constituency", 
            "state": "Indian Union", 
            "mp": "Awaiting Verified Intel", 
            "mla": "Awaiting Verified Intel",
            "district": "Regional Area",
            "booths": 50, 
            "turnout": "66.4%",
            "status": "Inactive"
        }

@app.get("/api/intelligence/live")
async def get_live_intelligence():
    # Fetch real-time electoral events for 2026 with deep metadata
    try:
        prompt = """
        Provide current electoral intelligence for India in May 2026.
        Include:
        1. 'next_major_event': {title, date (ISO), description}
        2. 'calendar': List of 3 upcoming significant electoral events {
            title, date, type, 
            details: {
                election_date, result_date, 
                candidates: [list of names with parties],
                total_seats, 
                total_constituencies,
                state_jurisdiction
            }
        }
        Return ONLY JSON.
        """
        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=prompt,
            config=types.GenerateContentConfig(response_mime_type="application/json")
        )
        import json
        return json.loads(response.text)
    except Exception as e:
        print(f"Live Intel Error: {e}")
        return {
            "next_major_event": {"title": "State Assembly Phase", "date": "2026-05-20", "description": "Next phase of regional democratic transition."},
            "calendar": [
                {
                    "title": "West Bengal Assembly", 
                    "date": "May 10, 2026", 
                    "type": "Election",
                    "details": {
                        "election_date": "May 10, 2026",
                        "result_date": "June 4, 2026",
                        "candidates": ["Mamata Banerjee (AITC)", "Suvendu Adhikari (BJP)", "Adhir Ranjan (INC)"],
                        "total_seats": 294,
                        "total_constituencies": 294,
                        "state_jurisdiction": "West Bengal"
                    }
                }
            ]
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
