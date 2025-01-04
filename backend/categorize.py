import torch
from transformers import pipeline
import json


class Categorize:

    def __init__(self):
        self.pipe = pipeline(
            "text-generation",
            model="meta-llama/Llama-3.2-1B-Instruct",
            torch_dtype=torch.bfloat16,
            device_map="auto"
        )

    def categorize_prompt(self, user_prompt):
        prompt = [
            {
                "role": "system",
                "content": f"""
        You are a robot that only outputs JSON.
        Your task is to respond in JSON format with the fields 'Frameworks/Tech Stack', 'Functionality/Features', and 'Purpose', and each field should output an array.
        The three fields should form a complete sentence describing a project idea.
        Do not use any new line characters or any whitespace at all on the JSON output.
        Input: {user_prompt}
        Output:
        """,
            },
        ]
        outputs = self.pipe(
            prompt,
            max_new_tokens=256,
        )
        generated_output = outputs[0]["generated_text"][-1]["content"]

        try:
            # Strip extra characters and parse the JSON
            start_index = generated_output.find("{")
            end_index = generated_output.rfind("}") + 1
            json_string = generated_output[start_index:end_index]
            parsed_json = json.loads(json_string)
            print("JSON PARSED")
            return parsed_json
        except json.JSONDecodeError as e:
            print("Failed to parse JSON:", e)
            print("Generated Text:", generated_output)
