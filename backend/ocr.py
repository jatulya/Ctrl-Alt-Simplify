from doctr.models import ocr_predictor
from doctr.io import DocumentFile
from pydantic import ValidationError
from pydantic import BaseModel
from typing import Literal
# Load image
# image_list=["label1.jpg","label2.jpg","label3.jpg","label4.jpg"]
# for image in image_list:
#     print(f"LAael {image}\n")
#     doc = DocumentFile.from_images(image)
    

#     # Load OCR model (DBNet + CRNN by default)
#     model = ocr_predictor(pretrained=True)

#     # Run OCR
#     result = model(doc)

#     # Export to dict
#     json_result = result.export()
#     for page in json_result['pages']:
#         for block in page['blocks']:
#             for line in block['lines']:
#                 text = ' '.join([w['value'] for w in line['words']])
#                 print(text)
import re


def extract_ingredients(image_path):
    doc = DocumentFile.from_images(image_path)
    model = ocr_predictor(pretrained=True)
    result = model(doc)
    
    full_text = ''
    for page in result.export()['pages']:
        for block in page['blocks']:
            for line in block['lines']:
                full_text += ' '.join([word['value'] for word in line['words']]) + ' '

    lowered_text = full_text.lower()

    start_patterns = [
    r"\bingredients?\b",
    r"\bingredients?[-_\s:]?",
    r"\bingredients?list\b",
    r"\bingredients?[\s_]?list\b",
    r"\bingre+di+ents?\b",
    r"\bIngredients?\b",
    r"\bIngredients?[-_\s:]?",
    r"\bIngredients?list\b",
    r"\bIngredients?[\s_]?list\b",
    r"\bIngre+di+ents?\b",      
    ]   

    # Search for first matching pattern
    start_idx = -1
    for pattern in start_patterns:
        match = re.search(pattern, lowered_text)
        if match:
            start_idx = match.start()
            break

    if start_idx == -1:
        print("⚠️ 'ingredients' not found in text.")
        return full_text.strip()

    # Slice from the match
    sliced = full_text[start_idx:]

    # Stop at these common post-ingredient sections
    stop_keywords = [
        "nutrition", "nutritional", "storage", "manufactured", "marketed","by","of","the",
        "keep", "expiry", "best before", "fssai", "net weight"
    ]
    stop_idx = min(
        [sliced.lower().find(word) for word in stop_keywords if word in sliced.lower()] or [len(sliced)]
    )
    sliced = sliced[:stop_idx]

    return sliced.strip()

    
def generate_analysis_prompt(ingredients, user_info):
    prompt = prompt = f"""
The user has the following:
- Allergens: {user_info['allergens']}
- Preferences: {user_info['preferences']}
- Health conditions: {user_info['health_conditions']}

Here are the food ingredients:
{ingredients}

Return ONLY this JSON object:

{{"ingredients":[...],
  "allergens": "yes" or "no",
  "healthImplication": "... (brief summary of health impact based on above info)",
  "dietaryPreference": "yes" or "no",
  "score": number from 1 (worst) to 10 (best)
}}

Do not include any additional text, explanation, markdown formatting, or line breaks outside this JSON object. The ingredients should be strictly the ingredients entered by user, but as an array
"""
    return prompt
import google.generativeai as genai

# Configure with your API key
genai.configure(api_key="AIzaSyDgbffeQ2_DiIrq1KdNwPQPH6J_NRlD0l0")

# Create a model (Gemini-pro is the most capable)
model = genai.GenerativeModel('gemini-2.5-flash')

def ask_llm(prompt: str) -> str:
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print("Error calling Gemini:", e)
        return ""
        import json




# ingredients=extract_ingredients("label1.jpg")

# user_profile = {
#     "name": "Alice",
#     "age": 30,
#     "allergens": ["peanuts", "gluten", "soy"],
#     "health_conditions": ["diabetes", "fatty liver"],
#     "preferences": ["vegetarian", "low sugar"]
# }
# prompt=generate_analysis_prompt(ingredients,user_profile)

# res=ask_llm(prompt)
# print(res)
#  output=parse_llm_output(res)

# print(output)