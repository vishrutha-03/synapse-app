from fastapi import FastAPI
from app.services.supabase import supabase
from app.routes.upload import router as upload_router

app = FastAPI()

app.include_router(upload_router)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/test-db")
def test_db():
    result = supabase.table("documents").select("*").execute()
    return {"data": result.data}