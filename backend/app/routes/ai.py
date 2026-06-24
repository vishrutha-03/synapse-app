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
import gc

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
    user_id = get_user_id(authorization)

    document_id = str(uuid.uuid4())
    file_path = file.filename

    try:
        # Save uploaded image
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(
                file.file,
                buffer
            )

        # OCR
        print("⏳ Initializing EasyOCR...")
        reader = easyocr.Reader(
            ['en'],
            gpu=False
        )

        print("📄 Extracting text...")
        result = reader.readtext(
            file_path,
            detail=0
        )

        extracted_text = " ".join(result)

        # Free memory
        del reader
        gc.collect()

        print("OCR TEXT:")
        print(extracted_text)

        # Check OCR output
        if not extracted_text.strip():
            raise HTTPException(
                status_code=400,
                detail="No text found in image."
            )

        # Gemini AI
        ai_data = generate_summary_and_flashcards(
            extracted_text
        )

        print("AI DATA:")
        print(ai_data)

        # Check if Gemini failed
        if "error" in ai_data:
            raise HTTPException(
                status_code=503,
                detail=ai_data["error"]
            )

        # Safety check
        if (
            "summary" not in ai_data or
            "flashcards" not in ai_data
        ):
            raise HTTPException(
                status_code=500,
                detail="AI failed to generate study material."
            )

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

        # Document structure
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

        # Save flashcards separately
        if flashcards:
            await flashcards_collection.insert_many(
                flashcards
            )

        return {
            "message": "success",
            "document_id": document_id,
            "summary": ai_data["summary"],
            "flashcards": ai_data["flashcards"]
        }

    except HTTPException:
        raise

    except Exception as e:
        print("ERROR:", str(e))

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:
        # Always delete temporary image
        if os.path.exists(file_path):
            os.remove(file_path)

        gc.collect()