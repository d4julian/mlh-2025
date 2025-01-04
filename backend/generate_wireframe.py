from huggingface_hub import InferenceClient
import os
from dotenv import load_dotenv
import uuid

class GenerateWireframe:
    def __init__(self):
        load_dotenv()
        self.client = InferenceClient("jkeisling/type-design-website", token=os.getenv("HUGGINGFACE_TOKEN"))

    def generate_wireframe(self, text: str) -> str:
        path = os.path.join("images", f"{uuid.uuid4()}.png")
        self.client.text_to_image(f"tpwlf_pg, {text}").save(path)
        return path

if __name__ == "__main__":
    generator = GenerateWireframe()
    print(generator.generate_wireframe("A restaurant website that helps users find the best deals on food using graphs and charts"))