import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
import pickle

class GenerateVectors:
    def __init__(self):
        df = pd.read_csv("backend/data.csv")
        df['success'] = (df['status'] == 'Active').astype(int)
        df = df[["long_description", "success"]]
        df.dropna(inplace=True)

        vectorizer = TfidfVectorizer(stop_words="english", max_features=5000)
        vectorizer.fit_transform(df["long_description"])

        pickle.dump(vectorizer, open("backend/vectorizer.pkl", "wb"))

if __name__ == "__main__":
    g = GenerateVectors()