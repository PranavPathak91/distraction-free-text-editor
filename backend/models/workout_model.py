import torch
import numpy as np


class WorkoutModel:
    def __init__(self) -> None:
        # Example: tiny neural net with random weights
        self.layer = torch.nn.Linear(10, 3)

    def recommend(self, user_vector: np.ndarray) -> str:
        tensor = torch.tensor(user_vector, dtype=torch.float32)
        output = self.layer(tensor)
        idx = torch.argmax(output).item()
        return ["cardio", "strength", "stretch"][idx]


model = WorkoutModel()
