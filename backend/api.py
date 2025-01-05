from fastapi import (
    FastAPI,
    HTTPException,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from mongodb import MongoDB
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime
import os
import json

# Import your existing modules
# Adjust these imports based on your actual module structure
# from mongodb import MongoDB  # Your database operations
from sentiment import Sentiment  # Your sentiment analysis
from generate_wireframe import GenerateWireframe  # Your image generation
from categorize import Categorize  # Your LLaMA model


sentiment = Sentiment()
generate = GenerateWireframe()
categorize = Categorize()

# Initialize your MongoDB connection
db = MongoDB()  # Adjust based on your MongoDB class implementation


# Request/Response Models
class PromptRequest(BaseModel):
    prompt: str
    max_length: Optional[int] = 1024
    temperature: Optional[float] = 0.7


class DataRequest(BaseModel):
    query: Dict
    limit: Optional[int] = 10


class AnalysisRequest(BaseModel):
    text: str
    options: Optional[Dict] = {}


app = FastAPI()


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# LLaMA Routes
@app.post("/api/categorize")
async def generate_text(request: PromptRequest):
    print(f"[LOG] Received prompt: {request.prompt}")  # Log the incoming prompt

    try:
        # For testing purposes, we'll return a dummy response
        return JSONResponse(
            content=json.loads(
                """
        {
    "Frameworks/Tech Stack": [
        "React",
        "Angular",
        "Vue.js",
        "Django",
        "Flask",
        "Laravel",
        "Ruby on Rails",
        "Express.js",
        "Nest.js",
        "Svelte"
    ],
    "Functionality/Features": [
        "User authentication and authorization",
        "Real-time data updates",
        "E-commerce functionality",
        "Social media integration",
        "Personalized recommendations",
        "Real-time messaging",
        "File sharing and storage",
        "Virtual reality and augmented reality",
        "Voice assistants",
        "Artificial intelligence and machine learning"
    ],
    "Purposes": [
        "To create a user-friendly and engaging online experience",
        "To provide a seamless and secure online transactional process",
        "To enable real-time communication and collaboration among users",
        "To offer personalized and relevant content to users",
        "To create a platform for social networking and community building",
        "To facilitate the development of virtual and augmented reality applications",
        "To enable the creation of voice-activated and gesture-controlled interfaces",
        "To provide a platform for artificial intelligence and machine learning applications",
        "To create a secure and reliable online storage and sharing service"
    ]
}"""
            )
        )
        result = categorize.categorize_prompt(request.prompt)
        return JSONResponse(content=result)
    except Exception as e:
        print(f"[ERROR] Error generating result: {e}")  # Log any errors
        raise HTTPException(status_code=500, detail=str(e))

# Data Routes
@app.get("/api/data/query")
async def query_all_prompts(limit: Optional[int] = None):
    try:
        results = await db.find("prompts", {}, limit=limit or 0)  # No limit if limit=0
        return {"results": results}
    except Exception as e:
        print(f"[ERROR] Error querying all prompts: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving all prompts.")


@app.post("/api/data/insert")
async def insert_data(prompt: PromptRequest):
    try:
        document = {"prompt": prompt.prompt}
        result = await db.insert_one("prompts", document)
        return JSONResponse(content={"inserted_prompt": str(result)})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Analysis Routes
@app.post("/api/analyze/sentiment")
async def analyze_text_sentiment(request: AnalysisRequest):
    try:
        result = sentiment.predict_success(request.text)
        return JSONResponse(content={"sentiment": result})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/analyze/embeddings")
async def generate_text_embedding(request: AnalysisRequest):
    try:
        embedding = generate_embedding(request.text)
        return JSONResponse(content={"embedding": embedding})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Image Routes
IMAGE_DIR = "backend/images"
os.makedirs(IMAGE_DIR, exist_ok=True)


@app.get("/api/images/{image_name}")
async def get_image(prompt: str):
    path = generate.generate_wireframe(prompt)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(path)


# Health Check
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
