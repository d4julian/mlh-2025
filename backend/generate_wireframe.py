import torch
from diffusers import DiffusionPipeline

pipe = DiffusionPipeline.from_pretrained("black-forest-labs/FLUX.1-dev")
pipe.load_lora_weights("jkeisling/type-design-website")

device = "cuda" if torch.cuda.is_available() else "cpu"
pipe.to(device)

prompt = "A web app that helps users find the best deals on flights using graphs and charts"
image = pipe(prompt).images[0]

image.show()