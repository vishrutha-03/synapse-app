from fastapi import APIRouter, HTTPException, Header
from app.services.database import documents_collection
from app.models.deck import DeckCreate
from app.services.auth_utils import SECRET_KEY, ALGORITHM
import jwt
import uuid

router = APIRouter(prefix="/decks", tags=["decks"])

# Helper to extract user_id from token
def get_user_id(authorization: str) -> str:
    try:
        token = authorization.replace("Bearer ", "")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.get("/")
async def get_decks(authorization: str = Header(...)):
    user_id = get_user_id(authorization)
    cursor = documents_collection.find({"user_id": user_id})
    decks = []
    async for deck in cursor:
        decks.append({
            "id": deck["id"],
            "title": deck.get("file_name") or "Untitled Deck",  # fix
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
    return {
        "id": deck["id"],
        "title": deck.get("file_name") or "Untitled Deck",
        "flashcards": deck.get("flashcards", []),
    }