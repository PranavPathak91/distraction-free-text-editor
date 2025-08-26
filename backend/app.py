from fastapi import FastAPI
from routers import workout, progress

app = FastAPI(title="AI Fitness App")

app.include_router(workout.router, prefix="/workouts", tags=["workouts"])
app.include_router(progress.router, prefix="/progress", tags=["progress"])


@app.get("/")
async def root():
    return {"message": "AI Fitness App backend is running!"}
