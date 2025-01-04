import torch
from transformers import pipeline
import json


class Categorize:

    def __init__(self):
        self.pipe = pipeline(
            "text-generation",
            model="meta-llama/Llama-3.2-1B-Instruct",
            torch_dtype=torch.bfloat16,
            device_map="auto",
        )

    def categorize_prompt(self, user_prompt):
        try:
            prompt = [
                {
                    "role": "system",
                    "content": f"""
            You are a robot that only outputs JSON.
            Your task is to respond in JSON format with the fields 'Frameworks/Tech Stack', 'Functionality/Features', and 'Purposes', and each field should output an array.

            Please include:
            - Ten popular Frameworks/Tech Stack that could be used in a project.
            - Ten Functionality/Features that could be implemented.
            - Five "Purposes" that the project could serve.

            Dont repeat the same item in the same field.
            The three fields should form a complete sentence describing a project idea.
            Do not use any new line characters or any whitespace at all on the JSON output.
            Input: {user_prompt}
            Output:
            """,
                },
            ]
            outputs = self.pipe(
                prompt,
                max_new_tokens=1024,
                temperature=0.2,
            )
            generated_output = outputs[0]["generated_text"][-1]["content"]
            print(generated_output)


            # Strip extra characters and parse the JSON
            start_index = generated_output.find("{")
            end_index = generated_output.rfind("}") + 1
            json_string = generated_output[start_index:end_index]
            parsed_json = json.loads(json_string)

            return parsed_json

        except json.JSONDecodeError as e:
            print(f"[ERROR] Error in categorize_prompt: {e}")  # Log any parsing errors
            raise
