import base64
import io
import os
import json
import re
from groq import Groq
from PIL import Image
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

OCR_PROMPT = """
You are a food label reader.

Look at this food product image carefully.

Your job:
1. Find the product name (if visible, otherwise write "Unknown Product")
2. Extract ALL ingredient names listed on the label

Return ONLY a valid JSON object. No explanation, no markdown, no code blocks. Just raw JSON.

Format:
{
  "productName": "Product name here",
  "ingredients": ["Ingredient 1", "Ingredient 2", "Ingredient 3"]
}

Rules:
- List every single ingredient, do not skip any
- Keep ingredient names exactly as printed on the label
- If you cannot read the ingredients clearly, return:
  {"productName": "Unknown", "ingredients": [], "error": "Could not read label clearly"}
"""


def prepare_image(image_bytes: bytes) -> str:
    """Convert raw bytes to base64 string."""
    img = Image.open(io.BytesIO(image_bytes))

    if img.mode in ("RGBA", "P", "LA"):
        img = img.convert("RGB")

    max_size = 1600
    if max(img.size) > max_size:
        ratio = max_size / max(img.size)
        new_size = (int(img.width * ratio), int(img.height * ratio))
        img = img.resize(new_size, Image.LANCZOS)

    buffer = io.BytesIO()
    img.save(buffer, format="JPEG")
    return base64.b64encode(buffer.getvalue()).decode("utf-8")


def extract_json(text: str) -> dict:
    text = text.strip()
    text = re.sub(r"```json\s*", "", text)
    text = re.sub(r"```\s*", "", text)
    text = text.strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            return json.loads(match.group())
        raise ValueError("Could not parse Groq response as JSON")


def extract_ingredients_from_image(image_bytes: bytes) -> dict:
    """Use Groq vision to extract product name and ingredient names from image."""
    b64_image = prepare_image(image_bytes)

    response = client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{b64_image}"
                        }
                    },
                    {
                        "type": "text",
                        "text": OCR_PROMPT
                    }
                ]
            }
        ],
        temperature=0.1,
        max_tokens=2048,
    )

    raw_text = response.choices[0].message.content
    return extract_json(raw_text)