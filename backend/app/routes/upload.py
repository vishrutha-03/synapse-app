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


@router.post("/upload")
async def upload_document(
    request: Request,
    file: UploadFile = File(None),
    raw_text: str = Form(None),
    authorization: str = Header(...),  # require auth
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

    ai_response = generate_summary_and_flashcards(text_to_process)

    if isinstance(ai_response, dict):
        return ai_response

    try:
        cleaned = ai_response.strip().replace("```json", "").replace("```", "")
        ai_data = json.loads(cleaned)
    except Exception as e:
        return {"error": "Failed to parse Gemini response", "details": str(e)}

    flashcards = [
        {
            "id": str(uuid.uuid4()),
            "document_id": document_id,
            "question": fc["question"],
            "answer": fc["answer"]
        }
        for fc in ai_data["flashcards"]
    ]

    # Save document with user_id and embedded flashcards
    new_doc = {
        "id": document_id,
        "user_id": user_id,                  # 👈 needed to fetch per user
        "file_name": file.filename if file else "Text input",
        "file_url": file_url,
        "summary": ai_data["summary"],
        "flashcards": flashcards,             # 👈 embedded so decks route works
        "emoji": "📄",
        "color": "#8A4FFF",
    }
    await documents_collection.insert_one(new_doc)

    # Still save to flashcards_collection separately
    if flashcards:
        await flashcards_collection.insert_many(flashcards)

    return {
        "message": "success",
        "document_id": document_id,
        "summary": ai_data["summary"],
        "flashcards": ai_data["flashcards"]
    }