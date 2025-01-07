import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
import pickle
import os


class GenerateVectors:
    def __init__(self):
        script_dir = os.path.dirname(__file__)
        data_path = os.path.join(script_dir, "data.csv")
        df = pd.read_csv(data_path)
        df["success"] = (df["status"] == "Active").astype(int)
        df = df[["long_description", "success"]]
        df.dropna(inplace=True)

        vectorizer = TfidfVectorizer(stop_words="english", max_features=5000)
        vectorizer.fit_transform(df["long_description"])

        pickle.dump(vectorizer, open("vectorizer.pkl", "wb"))


if __name__ == "__main__":
    g = GenerateVectors()
