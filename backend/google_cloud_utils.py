import os
import logging
from google.cloud import secretmanager
from google.cloud import storage
from google.cloud import firestore
from google.cloud import logging as cloud_logging
from google.cloud import aiplatform
from google.cloud import translate_v2 as translate
from google.cloud import pubsub_v1
from google.cloud import tasks_v2
from google.cloud import vision
import google.auth

# Initialize Google Cloud Clients
try:
    # 1. Cloud Logging Integration
    logging_client = cloud_logging.Client()
    logging_client.setup_logging()
    logger = logging.getLogger("electralearn_backend")
    logger.info("ElectraLearn: Cloud Logging Initialized")

    # 2. Secret Manager Integration
    secret_client = secretmanager.SecretManagerServiceClient()
    
    # 3. Cloud Storage Integration
    storage_client = storage.Client()
    
    # 4. Firestore Integration
    db = firestore.Client()
    
    # 5. Translation API Integration
    translate_client = translate.Client()
    
    # 6. Pub/Sub Integration
    publisher = pubsub_v1.PublisherClient()
    
    # 7. Cloud Tasks Integration
    tasks_client = tasks_v2.CloudTasksClient()
    
    # 8. Cloud Vision Integration
    vision_client = vision.ImageAnnotatorClient()
    
    # 9. Vertex AI Integration
    PROJECT_ID = os.getenv("GOOGLE_CLOUD_PROJECT", "refreshing-gear-495005-s0")
    LOCATION = os.getenv("GOOGLE_CLOUD_REGION", "us-central1")
    aiplatform.init(project=PROJECT_ID, location=LOCATION)
    logger.info(f"ElectraLearn: Vertex AI & Advanced Cloud Services Initialized for {PROJECT_ID}")

except Exception as e:
    print(f"Warning: Cloud Services not fully initialized: {e}")
    logger = logging.getLogger("electralearn_local")

def get_secret(secret_id, version_id="latest"):
    """
    Retrieves a secret from Google Cloud Secret Manager.
    """
    try:
        project_id = os.getenv("GOOGLE_CLOUD_PROJECT", "refreshing-gear-495005-s0")
        name = f"projects/{project_id}/secrets/{secret_id}/versions/{version_id}"
        response = secret_client.access_secret_version(request={"name": name})
        return response.payload.data.decode("UTF-8")
    except Exception as e:
        logger.error(f"Error retrieving secret {secret_id}: {e}")
        return os.getenv(secret_id) # Fallback to env

def upload_to_gcs(bucket_name, source_file_name, destination_blob_name):
    """
    Uploads a file to Google Cloud Storage.
    """
    try:
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(destination_blob_name)
        blob.upload_from_filename(source_file_name)
        logger.info(f"File {source_file_name} uploaded to {destination_blob_name}.")
        return blob.public_url
    except Exception as e:
        logger.error(f"Error uploading to GCS: {e}")
        return None

def save_user_score(user_id, score_data):
    """
    Saves user simulation/mythbuster scores to Firestore.
    """
    try:
        doc_ref = db.collection("user_scores").document(user_id)
        doc_ref.set(score_data, merge=True)
        logger.info(f"Score saved for user {user_id}")
        return True
    except Exception as e:
        logger.error(f"Error saving to Firestore: {e}")
        return False

def get_leaderboard(limit=10):
    """
    Retrieves top scores from Firestore.
    """
    try:
        users_ref = db.collection("user_scores")
        query = users_ref.order_by("score", direction=firestore.Query.DESCENDING).limit(limit)
        results = query.stream()
        return [doc.to_dict() for doc in results]
    except Exception as e:
        logger.error(f"Error fetching leaderboard: {e}")
        return []

def translate_content(text, target_language="hi"):
    """
    Translates content into target language (e.g., Hindi, Tamil).
    Boosts accessibility for diverse Indian electorate.
    Uses Google Cloud Translation API with Gemini AI as a professional fallback.
    """
    try:
        # Primary: Official Google Cloud Translation API
        result = translate_client.translate(text, target_language=target_language)
        translated = result['translatedText']
        print(f"Cloud Translation Success: {text[:20]}...")
        return translated
    except Exception as e:
        print(f"Cloud Translation Error, trying Gemini Fallback: {e}")
        try:
            # Fallback: Google Gemini AI (Vertex AI)
            from google import genai
            api_key = os.getenv("GEMINI_API_KEY") or os.getenv("VITE_GEMINI_API_KEY")
            if not api_key: return text
            
            client = genai.Client(api_key=api_key)
            prompt = f"Translate the following text into {target_language}. Return ONLY the translated text without any explanation: {text}"
            response = client.models.generate_content(
                model="gemini-1.5-flash",
                contents=prompt
            )
            translated = response.text.strip()
            print(f"Gemini Translation Success: {text[:20]}...")
            return translated
        except Exception as ge:
            print(f"Gemini Translation Error: {ge}")
            logger.error(f"Global Translation Failure: {ge}")
            return text

def schedule_voter_alert(user_id, alert_message, scheduled_time):
    """
    Uses Cloud Tasks to schedule a future alert (e.g., registration deadline).
    """
    try:
        project = os.getenv("GOOGLE_CLOUD_PROJECT", "refreshing-gear-495005-s0")
        queue = "voter-alerts"
        location = "us-central1"
        parent = tasks_client.queue_path(project, location, queue)
        
        task = {
            "app_engine_http_request": {
                "http_method": tasks_v2.HttpMethod.POST,
                "relative_uri": "/api/v1/notify",
                "body": json.dumps({"user_id": user_id, "message": alert_message}).encode()
            },
            "schedule_time": scheduled_time
        }
        response = tasks_client.create_task(request={"parent": parent, "task": task})
        logger.info(f"Task scheduled: {response.name}")
        return response.name
    except Exception as e:
        logger.error(f"Cloud Tasks Error: {e}")
        return None

def publish_event(topic_id, data):
    """
    Publishes an event to Cloud Pub/Sub for async processing.
    """
    try:
        project = os.getenv("GOOGLE_CLOUD_PROJECT", "refreshing-gear-495005-s0")
        topic_path = publisher.topic_path(project, topic_id)
        data_bytes = json.dumps(data).encode("utf-8")
        future = publisher.publish(topic_path, data_bytes)
        return future.result()
    except Exception as e:
        logger.error(f"Pub/Sub Error: {e}")
        return None

def analyze_document(image_path):
    """
    Uses Cloud Vision to extract text from documents (e.g., voter registration forms).
    """
    try:
        with open(image_path, "rb") as image_file:
            content = image_file.read()
        image = vision.Image(content=content)
        response = vision_client.text_detection(image=image)
        texts = response.text_annotations
        return texts[0].description if texts else ""
    except Exception as e:
        logger.error(f"Vision API Error: {e}")
        return ""
