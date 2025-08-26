from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()


class ProgressEntry(BaseModel):
    date: str
    metric: str
    value: float


# In-memory store for demonstration
progress_store: List[ProgressEntry] = []


@router.post("/")
async def add_progress(entry: ProgressEntry):
    progress_store.append(entry)
    return {"status": "added", "entry": entry}


@router.get("/")
async def get_progress():
    return progress_store
