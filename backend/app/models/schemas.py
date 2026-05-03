from pydantic import BaseModel
from typing import List, Optional, Dict

class ChatRequest(BaseModel):
    message: str
    history: List[Dict[str, str]] = []

class PincodeRequest(BaseModel):
    pincode: str

class TranslationRequest(BaseModel):
    text: str
    target_lang: str

class ProgressData(BaseModel):
    user_id: str
    score_data: Dict
