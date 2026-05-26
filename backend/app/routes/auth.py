from fastapi import APIRouter, HTTPException
from app.services.database import users_collection
from app.models.auth import UserCreate, UserLogin
from app.services.auth_utils import get_password_hash, verify_password, create_access_token
import uuid

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

@router.post("/signup")
async def signup(user: UserCreate):
    if not user.email.endswith("@bmsce.ac.in"):
        raise HTTPException(status_code=400, detail="Only @bmsce.ac.in college emails are allowed to sign up.")
    
    try:
        # Check if user already exists
        existing_user = await users_collection.find_one({"email": user.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Hash password and create user
        hashed_password = get_password_hash(user.password)
        user_id = str(uuid.uuid4())
        
        new_user = {
            "id": user_id,
            "email": user.email,
            "hashed_password": hashed_password,
            "username": user.email.split("@")[0].capitalize()
        }
        
        await users_collection.insert_one(new_user)
        
        # Generate token
        token = create_access_token({"sub": user_id, "email": user.email})
        
        return {
            "message": "User created successfully",
            "access_token": token,
            "user_id": user_id,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
async def login(user: UserLogin):
    try:
        # Strip whitespace from inputs
        email = user.email.strip()
        password = user.password.strip()
        # Find user by stripped email
        db_user = await users_collection.find_one({"email": email})
        if not db_user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Verify password using stripped password
        if not verify_password(password, db_user["hashed_password"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")
            
        # Generate token (include username)
        token = create_access_token({"sub": db_user["id"], "email": db_user["email"], "username": db_user.get("username")})
        
        return {
            "message": "Login successful",
            "access_token": token,
            "user_id": db_user["id"],
            "username": db_user.get("username"),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
