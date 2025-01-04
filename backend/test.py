import torch
from transformers import pipeline, TextIteratorStreamer, AutoTokenizer
import json
from threading import Thread
import logging
import re
import textwrap

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def generate_response(prompt: str):
    try:
        model_id = "meta-llama/Llama-3.2-1B-Instruct"
        logger.info(f"Loading tokenizer for model: {model_id}")
        tokenizer = AutoTokenizer.from_pretrained(model_id)

        streamer = TextIteratorStreamer(tokenizer, skip_prompt=True, timeout=60.0)

        logger.info(f"Initializing pipeline for model: {model_id}")
        pipe = pipeline(
            "text-generation",
            model=model_id,
            torch_dtype=torch.bfloat16,  # Ensure your hardware supports bfloat16
            device_map="auto",
            streamer=streamer
        )

        # Crafting the prompt to guide the model for NDJSON output
        full_prompt = textwrap.dedent(f"""
        <|begin_of_text|><|start_header_id|>system<|end_header_id|>
        You are an assistant that provides structured JSON responses only.
        Provide the following information in JSON format for creating a platform.
        Include the following fields in the JSON as arrays: Tech Stack, Use Cases, Recommendations, and Implementation Steps.

        Example:
        {{
        "Tech Stack": ["Express.js", "React", "Socket.io", "TensorFlow.js"],
        "Use Cases": [
            "Real-time chat and messaging",
            "AI-driven content recommendations",
            "Community event management",
            "User behavior analytics"
        ],
        "Recommendations": [
            "Utilize WebSockets (Socket.io) for real-time data transmission to ensure low-latency communication.",
            "Implement Redux for state management in React to maintain predictable application state.",
            "Leverage TensorFlow.js for integrating machine learning models directly into the frontend for faster inference.",
            "Adopt a microservices architecture with Express.js to enhance scalability and maintainability."
        ],
        "Implementation Steps": [
            "Set up the development environment with Node.js and install necessary dependencies.",
            "Design the frontend architecture using React and integrate Redux for state management.",
            "Develop the backend server using Express.js, ensuring RESTful API design.",
            "Implement real-time features with Socket.io for instant communication.",
            "Integrate TensorFlow.js to incorporate AI-driven functionalities like content recommendations.",
            "Conduct thorough testing (unit, integration, and end-to-end) to ensure reliability.",
            "Deploy the application using cloud services such as AWS or Heroku, setting up CI/CD pipelines for continuous integration and deployment.",
            "Monitor performance and iterate based on user feedback and analytics data."
        ]
        }}<|eot_id|><|start_header_id|>user<|end_header_id|>
        {prompt}<|eot_id|>
        <|start_header_id|>assistant<|end_header_id|>
        """)

        generation_kwargs = {
            "text_inputs": full_prompt,  # Correct parameter name
            "max_new_tokens": 20000,  # Adjusted for multiple entries
            "temperature": 0.2,
            "repetition_penalty": 1.2  # Add repetition penalty to prevent loops
        }

        logger.info("Starting text generation thread.")
        thread = Thread(target=pipe, kwargs=generation_kwargs)
        thread.start()

        collected_text = ""
        buffer = ""
        logger.info("Streaming response:")
        
        for new_text in streamer:
            buffer += new_text
            # Look for complete JSON objects in the buffer
            try:
                # Try to find opening and closing braces
                start_idx = buffer.find('{')
                end_idx = buffer.rfind('}')
                
                if start_idx != -1 and end_idx != -1 and start_idx < end_idx:
                    json_str = buffer[start_idx:end_idx + 1]
                    try:
                        parsed = json.loads(json_str)
                        response = {
                            "text": json_str,
                            "generated_text": parsed,
                            "finished": False
                        }
                        print(json.dumps(response))
                        # Clear the processed part from buffer
                        buffer = buffer[end_idx + 1:]
                    except json.JSONDecodeError:
                        # Keep accumulating if we don't have a valid JSON yet
                        continue
            except Exception as e:
                logger.error(f"Error processing stream: {e}")
                continue

        # Wait for the generation thread to finish
        thread.join()

        # Handle any remaining content in the buffer
        if buffer.strip():
            try:
                # Try to extract final JSON object
                start_idx = buffer.find('{')
                end_idx = buffer.rfind('}')
                if start_idx != -1 and end_idx != -1 and start_idx < end_idx:
                    final_json = buffer[start_idx:end_idx + 1]
                    parsed = json.loads(final_json)
                    final_response = {
                        "text": final_json,
                        "generated_text": parsed,
                        "finished": True
                    }
                else:
                    final_response = {
                        "text": buffer,
                        "generated_text": None,
                        "finished": True,
                        "error": "Incomplete JSON in final buffer"
                    }
            except json.JSONDecodeError:
                final_response = {
                    "text": buffer,
                    "generated_text": None,
                    "finished": True,
                    "error": "Invalid JSON in final buffer"
                }
            print(json.dumps(final_response))
        else:
            print(json.dumps({
                "text": "",
                "generated_text": None,
                "finished": True
            }))

    except Exception as e:
        logger.error(f"An error occurred: {e}")
        print(json.dumps({
            "text": "",
            "generated_text": None,
            "finished": True,
            "error": str(e)
        }))

# Example usage
if __name__ == "__main__":
    prompt = "I want to create a platform for social networking and community building with real-time data updates, artificial intelligence and machine learning using express.js, react"
    generate_response(prompt)
