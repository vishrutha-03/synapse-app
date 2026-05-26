from dotenv import load_dotenv
import os
from google import genai

load_dotenv(override=True)

api_key = os.getenv("GEMINI_API_KEY")
print("GEMINI KEY:", api_key)

client = genai.Client(api_key=api_key)

def generate_summary_and_flashcards(text: str):
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
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return response.text
    except Exception as e:
        return {"error": str(e)}

import os
from google import genai

load_dotenv(override=True)

api_key = os.getenv("GEMINI_API_KEY")
print("GEMINI KEY:", api_key)

client = genai.Client(api_key=api_key)

def generate_summary_and_flashcards(text: str):
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
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return response.text
    except Exception as e:
        return {"error": str(e)}

import os
from google import genai

load_dotenv(override=True)

<<<<<<< HEAD
api_key = os.getenv("GEMINI_API_KEY")

print("GEMINI KEY:", api_key)

client = genai.Client(api_key=api_key)

=======
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
>>>>>>> a1b087f (Finalize migration: dynamic username, PDF upload fix, cleanup)

def generate_summary_and_flashcards(text: str):

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
        response = client.models.generate_content(
<<<<<<< HEAD
            model="gemini-2.5-flash",
            contents=prompt
=======
            model='gemini-2.0-flash',
            contents=prompt,
>>>>>>> a1b087f (Finalize migration: dynamic username, PDF upload fix, cleanup)
        )

        return response.text

    except Exception as e:
        return {
            "error": str(e)
        }