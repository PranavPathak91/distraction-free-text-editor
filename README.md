# AI Fitness App

This repository contains a minimal scaffold for an AI‑first fitness application.

## Structure

- `backend/`: FastAPI server with simple AI workout recommendation.
- `frontend/`: React Native app (Expo) consuming the backend.

## Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload
```

## Frontend Setup

```bash
cd frontend
npm install
npm start
```
