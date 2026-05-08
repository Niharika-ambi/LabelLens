from groq_ocr import extract_ingredients_from_image
from model_service import classify_ingredient


async def scan_ingredients(image_bytes: bytes) -> dict:
    """
    Step 1 — Groq reads the image and extracts ingredient names
    Step 2 — BERT model classifies each ingredient
    """
    try:
        # Step 1: OCR with Groq
        ocr_result = extract_ingredients_from_image(image_bytes)

        product_name = ocr_result.get("productName", "Unknown Product")
        ingredient_names = ocr_result.get("ingredients", [])

        if not ingredient_names:
            return {
                "productName": product_name,
                "ingredients": [],
            }

        # Step 2: Classify each ingredient with BERT
        classified = []
        for i, name in enumerate(ingredient_names, start=1):
            result = classify_ingredient(name)
            classified.append({
                "id": i,
                "name": result["name"],
                "status": result["status"],
                "reason": result["reason"],
            })

        return {
            "productName": product_name,
            "ingredients": classified,
        }

    except Exception as e:
        raise RuntimeError(f"Model scan failed: {str(e)}")