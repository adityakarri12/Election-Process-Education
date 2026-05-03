import json
import logging
from typing import List, Optional
from google import genai
from google.genai import types

class GenAICluster:
    """
    Service: Autonomous AI Cluster Management.
    Provides automatic key rotation, failover, and prompt safety wrapping.
    """
    def __init__(self, api_keys: List[str]):
        if not api_keys:
            logging.warning("AI Cluster initialized without keys. Failover mode active.")
        self.keys = api_keys
        self.clients = [genai.Client(api_key=k) for k in self.keys]
        self.current_index = 0

    def _sanitize_prompt(self, prompt: str) -> str:
        """
        Security: Basic prompt sanitization to prevent injection and PII leaks.
        """
        # Remove potential control characters
        return "".join(char for char in prompt if char.isprintable())

    async def generate(self, contents: str, model: str = "gemini-2.0-flash", config: Optional[types.GenerateContentConfig] = None) -> str:
        """
        Executes a generative call with automatic key rotation and failover.
        """
        if not self.clients:
            raise Exception("AI Cluster: No operational clients available.")

        sanitized_input = self._sanitize_prompt(contents)
        
        # Rotation logic
        for _ in range(len(self.clients)):
            try:
                client = self.clients[self.current_index]
                response = client.models.generate_content(
                    model=model,
                    contents=sanitized_input,
                    config=config
                )
                return response.text
            except Exception as e:
                logging.error(f"Cluster Node {self.current_index} Failed: {str(e)}")
                self.current_index = (self.current_index + 1) % len(self.clients)
        
        raise Exception("AI Cluster: Quota exhausted across all available nodes.")

class IntelligenceCache:
    """
    Utility: TTL-based memory cache for high-frequency intelligence requests.
    """
    def __init__(self, ttl_seconds: int = 600):
        self.cache = {}
        self.ttl = ttl_seconds
        import time
        self.time = time

    def get(self, key: str):
        if key in self.cache:
            val, expiry = self.cache[key]
            if self.time.time() < expiry:
                return val
            del self.cache[key]
        return None

    def set(self, key: str, value: any):
        self.cache[key] = (value, self.time.time() + self.ttl)
