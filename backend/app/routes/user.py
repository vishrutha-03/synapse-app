import jwt
from fastapi import APIRouter, Header, HTTPException, status
from datetime import datetime, date, timedelta
from app.services.database import users_collection, decks_collection, study_logs_collection

SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

async def get_user_manually(authorization: str = Header(None)):
    """Decodes the incoming HTTP Authorization header token using the custom architecture"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing.")
    
    try:
        token_type, token = authorization.split(" ")
        if token_type.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid token type schema.")
        
        # Decode token payload
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_uuid: str = payload.get("sub") # This holds your db_user["id"] string uuid
        if user_uuid is None:
            raise HTTPException(status_code=401, detail="Invalid token identity claims.")
            
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token verification failed: {str(e)}")
        
    # Search your async MongoDB collection by matching your custom user "id" field string
    user = await users_collection.find_one({"id": user_uuid})
    if not user:
        raise HTTPException(status_code=404, detail="User account context not found in database.")
    
    return user


@router.get("/me/")
async def get_user_profile_analytics(authorization: str = Header(None)):
    current_user = await get_user_manually(authorization)
    user_id = current_user["id"] # Safely pulls your custom string uuid
    
    # Pull study logs from the cursor stream asynchronously
    cursor = study_logs_collection.find({"user_id": user_id}).sort("reviewed_at", -1)
    logs = await cursor.to_list(length=None)
    
    # Process unique calendar dates
    unique_dates = sorted(
        list({log["reviewed_at"].date() for log in logs if "reviewed_at" in log}), 
        reverse=True
    )
    
    # Continuous Calendar Streak Evaluation Engine
    current_streak = 0
    today = date.today()
    yesterday = today - timedelta(days=1)
    
    if unique_dates:
        if unique_dates[0] == today or unique_dates[0] == yesterday:
            current_streak = 1
            for i in range(len(unique_dates) - 1):
                day_difference = (unique_dates[i] - unique_dates[i+1]).days
                if day_difference == 1:
                    current_streak += 1
                elif day_difference == 0:
                    continue 
                else:
                    break 
        else:
            current_streak = 0 
            
    # ── 🛠️ NEW: EXPLICITLY TRACK CARDS STUDIED TODAY ──
    cards_studied_today = 0
    for log in logs:
        if "reviewed_at" in log:
            # Safely converts datetime to a clean date object for comparison
            log_date = log["reviewed_at"].date() if isinstance(log["reviewed_at"], datetime) else log["reviewed_at"]
            if log_date == today:
                cards_studied_today += log.get("cards_reviewed", 0)

    # Compute performance scoreboard calculations (Lifetime Metrics)
    total_cards = sum(log.get("cards_reviewed", 0) for log in logs)
    total_correct = sum(log.get("correct_count", 0) for log in logs)
    
    accuracy_ratio = (total_correct / total_cards) if total_cards > 0 else 0.0
    deck_count = await decks_collection.count_documents({"owner_id": user_id})
    
    join_year = 2026

    return {
        "username": current_user.get("username", "BMSCE Learner"),
        "join_year": join_year,
        "streak": current_streak,
        "total_cards_studied": total_cards,       # Lifetime Count
        "cards_studied_today": cards_studied_today, # 👈 Fixes the 0 Cards Home view bug!
        "total_decks_created": deck_count,
        "correct_answers_ratio": round(accuracy_ratio, 2)
    }


@router.post("/study-logs/")
async def record_study_session_event(payload: dict, authorization: str = Header(None)):
    # ── 🔍 TELEMETRY DIAGNOSTIC LOG PRINTS ──
    print("\n📥 ────────── RECEIVED STUDY LOG PAYLOAD ──────────")
    print(f"Raw Payload Data: {payload}")
    print("───────────────────────────────────────────────────\n")

    current_user = await get_user_manually(authorization)
    
    # Defensive data parsing: accommodates both camelCase and snake_case properties
    deck_id = payload.get("deck_id") or payload.get("deckId")
    cards_reviewed = payload.get("cards_reviewed") or payload.get("cardsReviewed", 0)
    correct_count = payload.get("correct_count") or payload.get("correctCount", 0)

    # Clean array structural variations if passed by search parameters
    if isinstance(deck_id, list) and len(deck_id) > 0:
        deck_id = deck_id[0]

    new_log = {
        "user_id": current_user["id"],
        "deck_id": str(deck_id) if deck_id else "general-review",
        "cards_reviewed": int(cards_reviewed),
        "correct_count": int(correct_count),
        "reviewed_at": datetime.now() # 👈 Fixes Timezone misalignment vs date.today()
    }
    
    result = await study_logs_collection.insert_one(new_log)
    print(f"✅ Successfully wrote study log document to MongoDB! Document Object ID: {result.inserted_id}")
    
    return {"status": "success", "message": "Metrics timeline log synced successfully."}