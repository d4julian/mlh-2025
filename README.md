
# Pieza

This is a comprehensive startup ideation and analysis application that transforms basic project concepts into detailed technical blueprints. When users input a project idea, the platform provides:
### 1. Automated Project Breakdown:

- Suggested purposes and use cases
- Potential features and functionality
- Recommended technology stacks and frameworks


### 2. Feasibility Analysis:

- Success probability prediction using sentiment analysis
- Implementation roadmap and steps
- Technical stack recommendations with rationale


### 3. Visual Prototyping:

- AI-generated wireframes/mockups
- Interactive component visualization

This application essentially serves as a startup idea forumlator, helping developers validate and structure their ideas while providing actionable insights and visual representations to kickstart development. It bridges the gap between initial concept and technical implementation by offering data-driven recommendations and visual prototypes.
## Demo

[![Pieza](https://img.youtube.com/vi/kV5AKrqGEKM/0.jpg)](https://youtu.be/kV5AKrqGEKM)
## Getting Started
#### - Python 3.8+
#### - Node.js 16+
#### - LLaMA Model Access

- Request access to Meta's LLaMA models: https://www.llama.com/
- Create a Hugging Face account: https://huggingface.co/join
- Get your Hugging Face access token: https://huggingface.co/settings/tokens
## Run Locally

Clone the project

```bash
  git clone https://github.com/d4julian/mlh-2025.git
```

Go to the project directory

```bash
  cd mlh-2025
```

Install dependencies

```bash
  cd mlh-2025/web
  npm install

  cd mlh-2025/backend
  pip install -r ./requirements.txt
```

Start React server

```bash
  cd mlh-2025/web
  npm run dev
```

Start Python server
```bash
  cd mlh-2025/backend
  uvicorn api:app
```


## Tech Stack

**Client:** React, TailwindCSS

**Server:** Python, FastAPI

**AI Models:** LLaMA (Text Generation), Hugging Face Models (Image Generation), Custom Sentiment Analysis

