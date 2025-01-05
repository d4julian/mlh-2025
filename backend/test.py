import torch
from transformers import pipeline, TextIteratorStreamer, AutoTokenizer, AutoModelForCausalLM
import json
from threading import Thread
import textwrap

SYSTEM_PROMPT = textwrap.dedent("""
    <|begin_of_text|><|start_header_id|>system<|end_header_id|>
    You are an AI assistant specialized in providing detailed insights and recommendations for startup ideas.
    Your response must be in **Newline-Delimited JSON (NDJSON)** format.

    **STRICT REQUIREMENTS:**
    - **Only output the following four categories:**
      - "Recommended Tech Stack"
      - "Use Cases"
      - "Recommendations"
      - "Implementation Steps"
    - **Each JSON object must be on a separate line** and contain **only one key-value pair**.
    - **Each JSON object must be properly formatted and enclosed with {{ }}**.
    - **Every array (`[...]`) must be fully closed before starting a new JSON object.**  
    - **Do NOT truncate JSON objects. Ensure every object is fully closed with a }} before starting a new one**.
    - **Do NOT summarize the response**.
    - **Do NOT combine multiple key-value pairs into a single JSON object**.
    - **Ensure that all JSON objects are valid and can be parsed without errors**.
    - **Before moving to the next JSON object, verify:**  
      - **Does the previous object end with `}}`?**  
      - **If it's an array (`[...]`), does it close properly before the next line?**  

    **STRICT FORMAT:**
    Your response must be formatted **exactly** like this:
    {{"Recommended Tech Stack": ["React", "Express.js"]}}
    {{"Use Cases": ["Use Case 1", "Use Case 2"]}}
    {{"Recommendations": ["Recommendation 1", "Recommendation 2"]}}
    {{"Implementation Steps": ["Step 1", "Step 2"]}}

    <|eot_id|><|start_header_id|>user<|end_header_id|>
    {prompt}<|eot_id|>
    <|start_header_id|>assistant<|end_header_id|>
    """)

def generate_response(text: str):
    model_id = "meta-llama/Llama-3.2-1B-Instruct"
    tokenizer = AutoTokenizer.from_pretrained(model_id)
    model = AutoModelForCausalLM.from_pretrained(model_id)
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Using device: {device}")
    
    model.to(device)
    inputs = tokenizer(text, return_tensors="pt", max_length=1024, truncation=True)
    inputs = {k: v.to(device) for k, v in inputs.items()}
    streamer = TextIteratorStreamer(tokenizer, skip_prompt=True, skip_special_tokens=True)

    generation_kwargs = dict(inputs, streamer=streamer, max_new_tokens=1024, do_sample=False, top_p=1.0, top_k=0)
    thread = Thread(
        target=model.generate,
        kwargs=generation_kwargs,
    )
    thread.start()
    
    buffer = ""
    decoder = json.JSONDecoder()
    while True:
        try:
            chunk = next(streamer)
            buffer += chunk
            print(chunk, end="", flush=True)

            while buffer := buffer.lstrip():
                try:
                    obj, idx = decoder.raw_decode(buffer)
                    buffer = buffer[idx:]
                    print(obj)
                except json.JSONDecodeError: break
        except StopIteration: break

if __name__ == "__main__":
    prompt = (
        "I want to create a platform for social networking and community building "
        "with real-time data updates, artificial intelligence and machine learning "
        "using express.js, react"
    )

    generate_response(SYSTEM_PROMPT.format(prompt=prompt))