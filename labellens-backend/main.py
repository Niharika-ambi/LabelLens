from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import ScanResult, ErrorResponse
from gemini_service import scan_ingredients

app = FastAPI(
    title="LabelLens API",
    description="AI-powered food ingredient scanner using Gemini Vision",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


@app.get("/")
def root():
    return {"status": "LabelLens API is running 🔍"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post(
    "/scan",
    response_model=ScanResult,
    responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
    summary="Scan a food packet image and analyse ingredients",
)
async def scan(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{file.content_type}'. Please upload a JPG, PNG or WEBP image."
        )

    image_bytes = await file.read()

    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="File too large. Maximum size is 10MB."
        )

    if len(image_bytes) == 0:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty."
        )

    try:
        result = await scan_ingredients(image_bytes)
        return result
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))