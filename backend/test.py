import torch
from transformers import pipeline, TextIteratorStreamer, AutoTokenizer, AutoModelForCausalLM
import json
from threading import Thread
import logging
import re
import textwrap

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def generate_response(text: str):
        model_id = "meta-llama/Llama-3.2-1B-Instruct"
        tokenizer = AutoTokenizer.from_pretrained(model_id)
        model = AutoModelForCausalLM.from_pretrained(model_id)
        inputs = tokenizer(text, return_tensors="pt", max_length=1024, truncation=True)
        streamer = TextIteratorStreamer(tokenizer)

        model.generate(
                inputs=inputs["input_ids"],
                streamer=streamer,
                max_length=1024, 
                pad_token_id=tokenizer.eos_token_id,
            )
        buffer = ""

        for text in streamer:
            buffer += text

        print(buffer)


# Example usage
if __name__ == "__main__":
    text = (
        "I want to create a platform for social networking and community building "
        "with real-time data updates, artificial intelligence and machine learning "
        "using express.js, react"
    )
    generate_response(text)
