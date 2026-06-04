from fastapi import APIRouter, UploadFile, File, Form, Request, Header, HTTPException
from app.services.database import documents_collection, flashcards_collection
from app.services.gemini import generate_summary_and_flashcards
from app.services.auth_utils import SECRET_KEY, ALGORITHM
import jwt
import uuid
import json
import os

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Helper to extract user_id from token
def get_user_id(authorization: str) -> str:
    try:
        token = authorization.replace("Bearer ", "")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


import re

@router.post("/upload")
async def upload_document(
    request: Request,
    file: UploadFile = File(None),
    raw_text: str = Form(None),
    authorization: str = Header(...),
):
    user_id = get_user_id(authorization)
    document_id = str(uuid.uuid4())
    file_url = None
    text_to_process = raw_text

    if file:
        file_bytes = await file.read()
        file_path = os.path.join(UPLOAD_DIR, f"{document_id}_{file.filename}")
        with open(file_path, "wb") as f:
            f.write(file_bytes)
        base_url = str(request.base_url).rstrip("/")
        file_url = f"{base_url}/uploads/{document_id}_{file.filename}"
        text_to_process = file_bytes.decode("utf-8", errors="ignore")

    print(f"\n📝 Processing text input (Length: {len(text_to_process) if text_to_process else 0} chars)...")
    ai_response = generate_summary_and_flashcards(text_to_process)

    # ── 🛠️ NEW BULLETPROOF JSON EXTRACTION ENGINE ──
    try:
        if isinstance(ai_response, dict):
            ai_data = ai_response
        else:
            print("🤖 Raw AI Text Received. Extracting clean JSON string...")
            # Uses regex to find everything between the outermost curly braces { ... }
            json_match = re.search(r"\{.*\}", ai_response, re.DOTALL)
            if json_match:
                clean_json_string = json_match.group(0)
                ai_data = json.loads(clean_json_string)
            else:
                raise ValueError("No valid JSON structure found in AI response text block.")
                
    except Exception as parse_error:
        print("\n❌ ────────── GEMINI JSON PARSING CRASH ────────── ❌")
        print(f"Error Type: {str(parse_error)}")
        print(f"Raw Output causing crash:\n{ai_response}")
        print("❌ ─────────────────────────────────────────────── ❌\n")
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to cleanly structure AI Flashcards: {str(parse_error)}"
        )

    # Convert to schema structure
    flashcards = [
        {
            "id": str(uuid.uuid4()),
            "document_id": document_id,
            "question": fc["question"],
            "answer": fc["answer"]
        }
        # Safely uses .get() to prevent missing key errors
        for fc in ai_data.get("flashcards", [])
    ]

    new_doc = {
        "id": document_id,
        "user_id": user_id,
        "file_name": file.filename if file else "Text input",
        "file_url": file_url,
        "summary": ai_data.get("summary", "No summary generated."),
        "flashcards": flashcards,
        "emoji": "📄",
        "color": "#8A4FFF",
    }
    
    # Save target logs
    await documents_collection.insert_one(new_doc)
    if flashcards:
        await flashcards_collection.insert_many(flashcards)
        print(f"🔥 Successfully saved document and {len(flashcards)} generated flashcards to MongoDB!")

    return {
        "message": "success",
        "document_id": document_id,
        "summary": new_doc["summary"],
        "flashcards": [ {"question": f["question"], "answer": f["answer"]} for f in flashcards ]
    }