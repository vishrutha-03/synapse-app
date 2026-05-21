from dotenv import load_dotenv
import os
import google.generativeai as genai

load_dotenv(override=True)

print("GEMINI KEY:", os.getenv("GEMINI_API_KEY"))

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.0-flash")


def generate_summary_and_flashcards(text: str):

    # prevent super huge prompts
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

    try:
        response = model.generate_content(prompt)

        return response.text

    except Exception as e:
        return {
            "error": str(e)
        }