import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGODB_URI)
print("MONGO URI:", MONGODB_URI)

db = client.synapse_db

users_collection = db.users
documents_collection = db.documents
flashcards_collection = db.flashcards
decks_collection = db["decks"]
study_logs_collection = db["study_logs"]
otp_collection = db["otp_codes"]
