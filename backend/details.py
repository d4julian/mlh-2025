import torch
from transformers import TextIteratorStreamer, AutoTokenizer, AutoModelForCausalLM
import json
from threading import Thread
import textwrap

class Details:

    def __init__(self):
        self.model_id = "meta-llama/Llama-3.2-1B-Instruct"
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_id)
        self.streamer = TextIteratorStreamer(self.tokenizer, skip_prompt=True, skip_special_tokens=True)
        self.model = AutoModelForCausalLM.from_pretrained(self.model_id)
        self.model.to(self.device)
        
        self.SYSTEM_PROMPT = textwrap.dedent("""
            <|begin_of_text|><|start_header_id|>system<|end_header_id|>
            You are an AI assistant specializing in startup recommendations.  
            Your response must be in **Newline-Delimited JSON (NDJSON)** format, where **each line contains exactly one JSON object** with a single key-value pair.

            **Generate only the following four categories:**
            - "Recommended Tech Stack"
            - "Potential Audience"
            - "Recommendations"
            - "Implementation Steps"

            **Response Formatting Rules:**
            - Each JSON object must have exactly **one** key from the categories above.
            - The value must be a **list of strings**.
            - No additional text, explanations, summaries, or nested objects.
            - Ensure each JSON object is **properly closed (`}}`) and the array `]` is closed within the list before starting a new one.
            - Do NOT repeat the same word or token more than once within any JSON object.
            - Only create 5 objects for each category.

            **JSONs Format:**
            {{"Recommended Tech Stack": []}}
            {{"Potential Audience": []}}
            {{"Recommendations": []}}
            {{"Implementation Steps": []}}

            <|eot_id|><|start_header_id|>user<|end_header_id|>
            {prompt}<|eot_id|>
            <|start_header_id|>assistant<|end_header_id|>
        """)

    def is_valid_json(self, json_str):
        try:
            json.loads(json_str)
            return True
        except json.JSONDecodeError:
            return False

    def fix_json_string(self, json_str):
        json_str = json_str.strip()
        
        # Try with just closing object
        if json_str.count("{") > json_str.count("}"):
            temp_str = json_str + "}"
            if self.is_valid_json(temp_str):
                return temp_str

        # Try with just closing array
        if json_str.count("[") > json_str.count("]"):
            temp_str = json_str[:-1] + "]}"
            if self.is_valid_json(temp_str):
                return temp_str

        # Try closing both array and object
        if json_str.count("[") > json_str.count("]") and json_str.count("{") > json_str.count("}"):
            temp_str = json_str + "]}"
            if self.is_valid_json(temp_str):
                return temp_str

        return json_str

    def process_line(self, line):
        line = line.strip()
        if not line: return None 

        if self.is_valid_json(line):
            try:
                obj = json.loads(line)
            except json.JSONDecodeError:
                return None
        else:
            fixed_json = self.fix_json_string(line)
            try:
                obj = json.loads(fixed_json)
            except json.JSONDecodeError:
                return None

        valid_keys = {"Recommended Tech Stack", "Potential Audience", "Recommendations", "Implementation Steps"}
        if len(obj) == 1 and list(obj.keys())[0] in valid_keys:
            key = list(obj.keys())[0]
            if isinstance(obj[key], list) and all(isinstance(item, str) for item in obj[key]):
                return obj
        return None

    def generate_response(self, text: str):
        inputs = self.tokenizer(self.SYSTEM_PROMPT.format(prompt=text), return_tensors="pt")
        inputs = {k: v.to(self.device) for k, v in inputs.items()}
        

        generation_kwargs = dict(inputs, streamer=self.streamer, max_new_tokens=1024)
        thread = Thread(
            target=self.model.generate,
            kwargs=generation_kwargs,
        )
        thread.start()
        
        buffer = ""
        decoder = json.JSONDecoder()
        while True:
            try:
                chunk = next(self.streamer)
                buffer += chunk
                print(chunk, end="", flush=True)

                lines = buffer.split("\n")

                completed_lines = lines[:-1]
                buffer = lines[-1]

                for line in completed_lines:
                    obj = self.process_line(line)
                    if obj:
                        obj = {k: [s.title() for s in v] for k, v in obj.items()}
                        yield json.dumps(obj, indent=2)
                        
            except StopIteration: break

if __name__ == "__main__":
    prompt = (
        "I want to create a platform for social networking and community building "
        "with real-time data updates, artificial intelligence and machine learning "
        "using express.js, react"
    )

    details = Details()

    details.generate_response(prompt)
