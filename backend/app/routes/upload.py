from fastapi import APIRouter, UploadFile, File, Form
from app.services.supabase import supabase
from app.services.gemini import generate_summary_and_flashcards
import uuid
import json

router = APIRouter()


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(None),
    raw_text: str = Form(None)
):

    document_id = str(uuid.uuid4())
    file_url = None
    text_to_process = raw_text

    # Handle file upload
    if file:
        file_bytes = await file.read()

        file_path = f"{document_id}/{file.filename}"

        supabase.storage.from_("documents").upload(
            file_path,
            file_bytes
        )

        file_url = (
            supabase.storage
            .from_("documents")
            .get_public_url(file_path)
        )

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
    supabase.table("documents").insert({
        "id": document_id,
        "file_name": file.filename if file else None,
        "file_url": file_url,
        "raw_text": text_to_process,
        "summary": ai_data["summary"]
    }).execute()

    # Save flashcards to DB
    flashcards = [
        {
            "document_id": document_id,
            "question": fc["question"],
            "answer": fc["answer"]
        }
        for fc in ai_data["flashcards"]
    ]

    supabase.table("flashcards").insert(
        flashcards
    ).execute()

    return {
        "message": "success",
        "document_id": document_id,
        "summary": ai_data["summary"],
        "flashcards": ai_data["flashcards"]
    }