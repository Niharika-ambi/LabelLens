import json
import os
import torch
from transformers import DistilBertTokenizerFast, DistilBertForSequenceClassification

# Model files are in the same directory
MODEL_PATH = os.path.dirname(os.path.abspath(__file__))

# Load label map
with open(os.path.join(MODEL_PATH, "label_map.json"), "r") as f:
    label_map = json.load(f)

label_map = {int(k): v for k, v in label_map.items()}

# Load tokenizer and model
tokenizer = DistilBertTokenizerFast.from_pretrained(MODEL_PATH)
model = DistilBertForSequenceClassification.from_pretrained(MODEL_PATH)
model.eval()

REASONS = {
    "good": "This ingredient is natural and safe for regular consumption.",
    "bad": "This ingredient is artificial or linked to potential health risks.",
    "moderate": "This ingredient is generally safe but may cause issues in large amounts.",
}


def classify_ingredient(name: str) -> dict:
    inputs = tokenizer(
        name,
        return_tensors="pt",
        truncation=True,
        max_length=64,
        padding="max_length",
    )

    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        predicted_id = torch.argmax(logits, dim=1).item()

    status = label_map[predicted_id]

    return {
        "name": name,
        "status": status,
        "reason": REASONS[status],
    }