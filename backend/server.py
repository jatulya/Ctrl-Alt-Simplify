from fastapi import FastAPI, File, UploadFile, Form
from tempfile import NamedTemporaryFile
import shutil
from ocr import extract_ingredients,generate_analysis_prompt,ask_llm
app = FastAPI()

@app.post("/analyze")
async def analyze(
    image: UploadFile = File(...),
    allergens: str = Form(...),
    preferences: str = Form(...),
    health_conditions: str = Form(...)
):
    # Save image
    temp_file = NamedTemporaryFile(delete=False)
    with temp_file as f:
        shutil.copyfileobj(image.file, f)
    image_path = temp_file.name

    # Run OCR
    ingredients = extract_ingredients(image_path)

    # Ask LLM
    prompt = generate_analysis_prompt(ingredients, {
        "allergens": allergens,
        "preferences": preferences,
        "health_conditions": health_conditions
    })

    response = ask_llm(prompt)

    return {"result": response}