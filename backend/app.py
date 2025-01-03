import streamlit as st
from sentiment import Sentiment

st.title("Hackathon Idea Generator")

user_prompt = st.text_input("Enter your prompt:", "")
sentiment = Sentiment()

if st.button("Generate"):
    if user_prompt:
        st.write("You entered:", user_prompt)
        #TODO: Add the code to generate the prompt here
    else:
        st.warning("Please enter a prompt first!")
