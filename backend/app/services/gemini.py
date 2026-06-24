import os
import json
import time
from dotenv import load_dotenv
from google import genai

load_dotenv(override=True)

# List of API keys (add both in your .env file)
API_KEYS = [
    os.getenv("GEMINI_API_KEY"),
    os.getenv("GEMINI_API_KEY2")
]


def generate_summary_and_flashcards(text: str):

    # Limit very large OCR outputs
    text = text[:5000]

    prompt = f"""
    You are a study assistant.

    Given the following text:
    1. Write a concise summary (max 5 sentences)
    2. Generate 5 flashcards as question/answer pairs

    Respond ONLY in valid JSON format.

    Example:
    {{
        "summary": "summary here",
        "flashcards": [
            {{"question": "q1", "answer": "a1"}},
            {{"question": "q2", "answer": "a2"}}
        ]
    }}

    Text:
    {text}
    """

    # Try each API key
    for api_key in API_KEYS:

        # Skip empty keys
        if not api_key:
            continue

        print(f"Using API key: {api_key[:10]}...")

        client = genai.Client(
            api_key=api_key
        )

        # Retry 3 times with current key
        for attempt in range(3):

            try:
                response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt
                )

                cleaned = response.text.strip()

                # Remove markdown if Gemini sends it
                cleaned = cleaned.replace(
                    "```json",
                    ""
                )

                cleaned = cleaned.replace(
                    "```",
                    ""
                )

                cleaned = cleaned.strip()

                data = json.loads(cleaned)

                # Validate response format
                if (
                    "summary" not in data or
                    "flashcards" not in data
                ):
                    return {
                        "error":
                        "Gemini returned invalid format"
                    }

                return data

            except Exception as e:

                print(
                    f"API key {api_key[:10]} "
                    f"attempt {attempt + 1} failed:"
                )

                print(str(e))

                # Wait before retrying
                if attempt < 2:
                    time.sleep(5)

        print(
            "Current API key exhausted. "
            "Trying backup key..."
        )

    # All keys failed
    return {
        "error": (
            "AI service is currently busy. "
            "Please try again later."
        )
    }