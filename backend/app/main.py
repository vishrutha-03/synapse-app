from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes.upload import router as upload_router
from app.routes.auth import router as auth_router
import os

app = FastAPI()

# Ensure uploads directory exists
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for local testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Synapse API. Go to /docs for the API documentation."}

app.include_router(upload_router)
app.include_router(auth_router)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/test-db")
def test_db():
    result = supabase.table("documents").select("*").execute()
    return {"data": result.data}