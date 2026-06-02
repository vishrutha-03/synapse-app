from fastapi import APIRouter, UploadFile, File, Header, HTTPException
from app.services.database import (
    documents_collection,
    flashcards_collection
)
from app.services.gemini import (
    generate_summary_and_flashcards
)
from app.services.auth_utils import (
    SECRET_KEY,
    ALGORITHM
)

import jwt
import uuid
import easyocr
import shutil
import os

router = APIRouter(
    prefix="/ai",
    tags=["ai"]
)

# Get logged in user
def get_user_id(authorization: str) -> str:

    try:

        token = authorization.replace(
            "Bearer ",
            ""
        )

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload.get("sub")

    except Exception:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )


@router.post("/upload-images")
async def upload_images(
    authorization: str = Header(...),
    file: UploadFile = File(...)
):

    # Current logged in user
    user_id = get_user_id(
        authorization
    )

    # Unique document ID
    document_id = str(uuid.uuid4())

    # Temporary image path
    file_path = file.filename

    # Save uploaded image temporarily
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    # OCR reader
    reader = easyocr.Reader(['en'])

    # Extract text from image
    result = reader.readtext(
        file_path,
        detail=0
    )

    extracted_text = " ".join(result)

    print("OCR TEXT:")
    print(extracted_text)

    # Gemini AI summary + flashcards
    ai_data = generate_summary_and_flashcards(
        extracted_text
    )

    print("AI DATA:")
    print(ai_data)

    # Build flashcards list
    flashcards = [
        {
            "id": str(uuid.uuid4()),
            "document_id": document_id,
            "question": fc["question"],
            "answer": fc["answer"]
        }
        for fc in ai_data["flashcards"]
    ]

    # Same structure as normal text upload
    new_doc = {
        "id": document_id,
        "user_id": user_id,
        "file_name": file.filename,
        "summary": ai_data["summary"],
        "flashcards": flashcards,
        "emoji": "🖼️",
        "color": "#8A4FFF",
    }

    print("NEW DOC:")
    print(new_doc)

    # Save document
    result = await documents_collection.insert_one(
        new_doc
    )

    print("INSERTED:")
    print(result.inserted_id)

    # Save flashcards separately too
    if flashcards:

        await flashcards_collection.insert_many(
            flashcards
        )

    # Delete temporary image
    if os.path.exists(file_path):
        os.remove(file_path)

    return {
        "message": "success",
        "document_id": document_id,
        "summary": ai_data["summary"],
        "flashcards": ai_data["flashcards"]
    }