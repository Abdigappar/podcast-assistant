import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv('GROQ_API_KEY'))
MODEL  = os.getenv('LLM_MODEL', 'llama-3.1-8b-instant')

SYSTEM_PROMPT = """You are an expert podcast script writer.
When given a topic or idea, write a clear, engaging podcast script with:
1. A catchy intro (30 seconds)
2. Main talking points (3-5 points)
3. Transitions between points
4. A memorable outro with a call-to-action

Keep the tone conversational, friendly, and engaging.
Format the script clearly with labels like [INTRO], [POINT 1], [OUTRO]."""


def generate_script(user_prompt: str) -> str:
    """
    Send a prompt to Groq and return the generated podcast script.

    Args:
        user_prompt: The topic or idea for the podcast episode.

    Returns:
        The generated script as a string, or an error message.
    """
    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user",   "content": user_prompt},
            ],
            temperature=0.7,
            max_tokens=1500,
        )
        return response.choices[0].message.content

    except Exception as e:
        return f"AI Error: {str(e)}"
