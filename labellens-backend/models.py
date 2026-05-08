from pydantic import BaseModel
from typing import List, Literal


class Ingredient(BaseModel):
    id: int
    name: str
    status: Literal["good", "bad", "moderate"]
    reason: str


class ScanResult(BaseModel):
    productName: str
    ingredients: List[Ingredient]


class ErrorResponse(BaseModel):
    error: str
    detail: str
