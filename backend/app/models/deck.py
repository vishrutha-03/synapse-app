from pydantic import BaseModel
from typing import List, Optional

class Flashcard(BaseModel):
    question: str
    answer: str

class DeckCreate(BaseModel):
    title: str
    emoji: Optional[str] = "📚"
    color: Optional[str] = "#8A4FFF"
    flashcards: Optional[List[Flashcard]] = []

class DeckResponse(BaseModel):
    id: str
    title: str
    emoji: str
    color: str
    card_count: int