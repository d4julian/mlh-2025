from huggingface_hub import InferenceClient
import os
from dotenv import load_dotenv
load_dotenv()
client = InferenceClient("jkeisling/type-design-website", token=os.getenv("HUGGINGFACE_TOKEN"))

# output is a PIL.Image object
image = client.text_to_image("tpwlf_pg, A restaurant website that helps users find the best deals on food using graphs and charts")

image.show()