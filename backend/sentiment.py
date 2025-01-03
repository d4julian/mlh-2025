import os
from dotenv import load_dotenv
import pandas as pd

load_dotenv()
KAGGLE_API_KEY = os.getenv("KAGGLE_API_KEY")

df = pd.read_csv("startupdata.csv")

df.head()