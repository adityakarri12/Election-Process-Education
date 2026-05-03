import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
load_dotenv(dotenv_path="../.env")

API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("VITE_GEMINI_API_KEY")
client = genai.Client(api_key=API_KEY)

for model in client.models.list():
    print(model.name)
