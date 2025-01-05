import torch
from transformers import TextIteratorStreamer, AutoTokenizer, AutoModelForCausalLM
import json
from threading import Thread
import textwrap
import queue

class Details:

    def __init__(self):
        self.model_id = "meta-llama/Llama-3.2-1B-Instruct"
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_id)
        self.model = AutoModelForCausalLM.from_pretrained(self.model_id)
        self.model.to(self.device)
        
        self.SYSTEM_PROMPT = textwrap.dedent("""
            <|begin_of_text|><|start_header_id|>system<|end_header_id|>
            You are an AI assistant specializing in startup recommendations.  
            Provide a **high-level outline** of key steps for {category}.  
            Focus on **conceptual steps and structure** rather than implementation details.
            Do not provide specific, detailed instructions on how to accomplish the task, rather provide a brief, high-level overview. 
            Avoid **code, JSON, configurations, or specific command-line instructions.** 
            Format the response as an **outline** using bullet points (**not numbered steps**) for clarity.
            Each bullet point should be **one sentence only**—keep it concise.  
            Keep explanations **brief and strategic** rather than technical.  
            Use clear markdown formatting for readability.

            Generate a response for the {category} based on the prompt.

            <|eot_id|><|start_header_id|>user<|end_header_id|>
            {prompt}<|eot_id|>
            <|start_header_id|>assistant<|end_header_id|>
        """)
        self.valid_keys = {"Recommended Tech Stack", "Recommendations", "Implementation Steps"}
    
    def generate_all_responses(self, prompt: str):
        """
        Starts separate threads for each category and yields NDJSON lines as updates arrive.
        """
        output_queue = queue.Queue()
        threads = []
        sentinel = object()  # Unique object to signal completion

        # Start a thread for each category
        for key in self.valid_keys:
            thread = Thread(target=self.generate_response, args=(prompt, key, output_queue, sentinel))
            thread.start()
            threads.append(thread)
        
        # Number of completed threads
        completed_threads = 0
        while completed_threads < len(threads):
            item = output_queue.get()
            if item is sentinel:
                completed_threads += 1
            else:
                category, chunk = item
                ndjson_line = json.dumps({"category": category, "update": chunk})
                yield ndjson_line
        
        # Ensure all threads have finished
        for thread in threads:
            thread.join()
    
    def generate_response(self, text: str, key: str, output_queue: queue.Queue, sentinel):
        """
        Generates response for a specific category and puts updates into the queue.
        """
        streamer = TextIteratorStreamer(self.tokenizer, skip_prompt=True, skip_special_tokens=True)
        inputs = self.tokenizer(self.SYSTEM_PROMPT.format(prompt=text, category=key), return_tensors="pt")
        inputs = {k: v.to(self.device) for k, v in inputs.items()}
        
        generation_kwargs = dict(inputs, streamer=streamer, max_new_tokens=1024, temperature=0.2)
        # Start generation in a separate thread
        thread = Thread(target=self.model.generate, kwargs=generation_kwargs)
        thread.start()
        
        buffer = ""
        for chunk in streamer:
            buffer += chunk
            output_queue.put((key, chunk))
        
        # Wait for the generation thread to finish
        thread.join()
        # Signal that this category's generation is complete
        output_queue.put(sentinel)

if __name__ == "__main__":
    prompt = (
        "I want to create a platform for social networking and community building "
        "with real-time data updates, artificial intelligence and machine learning "
        "using express.js, react"
    )

    details = Details()

    for ndjson_line in details.generate_all_responses(prompt):
        print(ndjson_line)
