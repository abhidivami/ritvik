from pydantic_ai.models.openai import OpenAIModel
from pydantic_ai.providers.openai import OpenAIProvider

def make_ollama_model(model_name="hf.co/unsloth/Qwen3-8B-128K-GGUF:Q4_K_M", base_url="http://localhost:11434/v1"):
    """Create an Ollama model with the specified name and base URL."""
    return OpenAIModel(model_name=model_name, provider=OpenAIProvider(base_url=base_url))