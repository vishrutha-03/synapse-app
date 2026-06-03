from fastapi import APIRouter, HTTPException, Header
from app.services.database import documents_collection
from app.models.deck import DeckCreate
from app.services.auth_utils import SECRET_KEY, ALGORITHM
from pydantic import BaseModel
from typing import Optional
import jwt
import uuid

router = APIRouter(prefix="/decks", tags=["decks"])


# ── helpers ──────────────────────────────────────────────────────────────────

def get_user_id(authorization: str) -> str:
    try:
        token = authorization.replace("Bearer ", "")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


# ── request bodies ────────────────────────────────────────────────────────────

class RenameDeckBody(BaseModel):
    title: str
    emoji: Optional[str] = None


class EditFlashcardBody(BaseModel):
    question: str
    answer: str


# ── existing endpoints ────────────────────────────────────────────────────────

@router.get("/")
async def get_decks(authorization: str = Header(...)):
    user_id = get_user_id(authorization)
    cursor = documents_collection.find({"user_id": user_id})
    decks = []
    async for deck in cursor:
        decks.append({
            "id": deck["id"],
            "title": deck.get("title") or deck.get("file_name") or "Untitled Deck",
            "emoji": deck.get("emoji", "📄"),
            "color": deck.get("color", "#8A4FFF"),
            "card_count": len(deck.get("flashcards", [])),
        })
    return decks


@router.post("/")
async def create_deck(deck: DeckCreate, authorization: str = Header(...)):
    user_id = get_user_id(authorization)
    deck_id = str(uuid.uuid4())
    new_deck = {
        "id": deck_id,
        "user_id": user_id,
        "title": deck.title,
        "emoji": deck.emoji,
        "color": deck.color,
        "flashcards": [f.dict() for f in deck.flashcards],
    }
    await documents_collection.insert_one(new_deck)
    return {"message": "Deck created", "id": deck_id}


@router.get("/{deck_id}")
async def get_deck(deck_id: str, authorization: str = Header(...)):
    user_id = get_user_id(authorization)
    deck = await documents_collection.find_one({"id": deck_id, "user_id": user_id})
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found")

    # Inject stable IDs for flashcards if they don't have them yet
    flashcards = deck.get("flashcards", [])
    for i, card in enumerate(flashcards):
        if "id" not in card:
            card["id"] = str(uuid.uuid4())

    return {
        "id": deck["id"],
        "title": deck.get("title") or deck.get("file_name") or "Untitled Deck",
        "emoji": deck.get("emoji", "📄"),
        "color": deck.get("color", "#8A4FFF"),
        "flashcards": flashcards,
    }


# ── NEW: deck CRUD ────────────────────────────────────────────────────────────

@router.patch("/{deck_id}")
async def rename_deck(
    deck_id: str,
    body: RenameDeckBody,
    authorization: str = Header(...),
):
    """Rename a deck and/or update its emoji."""
    user_id = get_user_id(authorization)
    deck = await documents_collection.find_one({"id": deck_id, "user_id": user_id})
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found")

    update: dict = {"title": body.title}
    if body.emoji is not None:
        update["emoji"] = body.emoji

    await documents_collection.update_one(
        {"id": deck_id, "user_id": user_id},
        {"$set": update},
    )
    return {"message": "Deck updated"}


@router.delete("/{deck_id}")
async def delete_deck(deck_id: str, authorization: str = Header(...)):
    """Delete an entire deck."""
    user_id = get_user_id(authorization)
    result = await documents_collection.delete_one({"id": deck_id, "user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Deck not found")
    return {"message": "Deck deleted"}


# ── NEW: flashcard CRUD ───────────────────────────────────────────────────────

@router.patch("/{deck_id}/cards/{card_id}")
async def edit_flashcard(
    deck_id: str,
    card_id: str,
    body: EditFlashcardBody,
    authorization: str = Header(...),
):
    """Edit the question and/or answer of a single flashcard."""
    user_id = get_user_id(authorization)
    deck = await documents_collection.find_one({"id": deck_id, "user_id": user_id})
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found")

    flashcards = deck.get("flashcards", [])
    card_index = next(
        (i for i, c in enumerate(flashcards) if c.get("id") == card_id), None
    )
    if card_index is None:
        raise HTTPException(status_code=404, detail="Flashcard not found")

    flashcards[card_index]["question"] = body.question
    flashcards[card_index]["answer"] = body.answer

    await documents_collection.update_one(
        {"id": deck_id, "user_id": user_id},
        {"$set": {"flashcards": flashcards}},
    )
    return {"message": "Flashcard updated"}


@router.delete("/{deck_id}/cards/{card_id}")
async def delete_flashcard(
    deck_id: str,
    card_id: str,
    authorization: str = Header(...),
):
    """Delete a single flashcard from a deck."""
    user_id = get_user_id(authorization)
    deck = await documents_collection.find_one({"id": deck_id, "user_id": user_id})
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found")

    flashcards = deck.get("flashcards", [])
    new_cards = [c for c in flashcards if c.get("id") != card_id]

    if len(new_cards) == len(flashcards):
        raise HTTPException(status_code=404, detail="Flashcard not found")

    await documents_collection.update_one(
        {"id": deck_id, "user_id": user_id},
        {"$set": {"flashcards": new_cards}},
    )
    return {"message": "Flashcard deleted"}