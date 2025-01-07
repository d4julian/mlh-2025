import streamlit as st
from backend.model_services.sentiment.sentiment import Sentiment
from backend.model_services.categorize import Categorize

st.title("Hackathon Idea Generator")


@st.cache_resource
def load_data():
    return Categorize()


categorize = load_data()
sentiment = Sentiment()

user_prompt = st.text_input("Enter your prompt:", "")

if st.button("Generate"):
    if user_prompt:
        with st.spinner("Generating..."):
            result = categorize.categorize_prompt(user_prompt)
        st.success("Idea generated successfully!")
        st.json(result)
    else:
        st.warning("Please enter a prompt first!")
