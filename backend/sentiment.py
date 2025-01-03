from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import pickle
from generate_vectors import GenerateVectors
import os
import pandas as pd

class Sentiment:
    def __init__(self):
        if not os.path.exists("vectorizer.pkl"):
            g = GenerateVectors()
        self.vectorizer = pickle.load(open("vectorizer.pkl", "rb"))
        self.df = pd.read_csv("data.csv")
        self.df['success'] = (self.df['status'] == 'Active').astype(int)
        self.df = self.df[["long_description", "success"]]
        self.df.dropna(inplace=True)
        self.matrix = self.vectorizer.transform(self.df["long_description"])

    def predict_success(self, idea):
        idea_vector = self.vectorizer.transform([idea])
        similarities = cosine_similarity(idea_vector, self.matrix)
        success = self.df["success"].values
        weighted_success = np.dot(similarities, success) / np.sum(similarities)

        return round(float(weighted_success[0] * 100), 2)
if __name__ == "__main__":
    s = Sentiment()
    #print(s.predict_success("A web app that helps users find the best deals on flights using graphs and charts"))
    print(s.predict_success("A app that finds stocks with high growth potential"))