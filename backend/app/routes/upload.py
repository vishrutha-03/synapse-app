from fastapi import APIRouter, UploadFile, File, Form, Request
from app.services.database import documents_collection, flashcards_collection
from app.services.gemini import generate_summary_and_flashcards
import uuid
import json
import os

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_document(
    request: Request,
    file: UploadFile = File(None),
    raw_text: str = Form(None)
):

    document_id = str(uuid.uuid4())
    file_url = None
    text_to_process = raw_text

    # Handle file upload locally
    if file:
        file_bytes = await file.read()

        file_path = os.path.join(UPLOAD_DIR, f"{document_id}_{file.filename}")
        
        with open(file_path, "wb") as f:
            f.write(file_bytes)

        base_url = str(request.base_url).rstrip("/")
        file_url = f"{base_url}/uploads/{document_id}_{file.filename}"

        text_to_process = file_bytes.decode(
            "utf-8",
            errors="ignore"
        )

    # Generate summary and flashcards
    ai_response = generate_summary_and_flashcards(text_to_process)

    # Handle Gemini failure
    if isinstance(ai_response, dict):
        return ai_response

    try:

        cleaned = (
            ai_response
            .strip()
            .replace("```json", "")
            .replace("```", "")
        )

        ai_data = json.loads(cleaned)

    except Exception as e:

        return {
            "error": "Failed to parse Gemini response",
            "details": str(e),
            "raw_response": ai_response
        }

    # Save document to DB
    new_doc = {
        "id": document_id,
        "file_name": file.filename if file else None,
        "file_url": file_url,
        "raw_text": text_to_process,
        "summary": ai_data["summary"]
    }
    await documents_collection.insert_one(new_doc)

    # Save flashcards to DB
    flashcards = [
        {
            "id": str(uuid.uuid4()),
            "document_id": document_id,
            "question": fc["question"],
            "answer": fc["answer"]
        }
        for fc in ai_data["flashcards"]
    ]

    if flashcards:
        await flashcards_collection.insert_many(flashcards)

    return {
        "message": "success",
        "document_id": document_id,
        "summary": ai_data["summary"],
        "flashcards": ai_data["flashcards"]
    }