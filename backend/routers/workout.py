from fastapi import APIRouter
from pydantic import BaseModel
from models.workout_model import model
import numpy as np

router = APIRouter()


class WorkoutRequest(BaseModel):
    level: int
    fatigue: float
    goal: str


@router.post("/recommend")
async def recommend_workout(req: WorkoutRequest):
    user_vec = np.array([req.level, req.fatigue, len(req.goal)])
    suggestion = model.recommend(user_vec)
    return {"recommended_workout": suggestion}


@router.get("/")
async def list_workouts():
    return [
        {"id": 1, "name": "Push-ups"},
        {"id": 2, "name": "Jogging"},
        {"id": 3, "name": "Yoga Stretch"},
    ]
