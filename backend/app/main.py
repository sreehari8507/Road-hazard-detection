from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .api.endpoints import router as api_router
from .database.seed import seed_database

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize and seed SQLite database
    seed_database()
    yield

app = FastAPI(
    title="CYCLOPS AI Road Hazard & Environmental Intelligence API",
    description="Backend API for road hazard detection, risk assessment, and speed advisories.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration for local development and demo access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def root():
    return {
        "platform": "CYCLOPS AI Road Hazard & Environmental Intelligence",
        "motto": "See the Road. Understand the Risk. Protect the Future.",
        "documentation": "/docs",
        "api_prefix": "/api"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
