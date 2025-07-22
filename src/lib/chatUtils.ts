import { useUserPreferences } from "./context";

export interface UserProfile {
  allergies: string[];
  dietaryPreferences: string[];
  healthConditions: string[];
}



const SYSTEM_MESSAGE = `You are a helpful assistant that helps users understand food ingredients.
You must answer based on the user's allergies, dietary preferences, and health conditions.
If the user's question is unrelated to food or health, politely tell them you only assist with food ingredients and health.`;

/**
 * Builds the full prompt string from user profile and query
 */
export const buildPrompt = (
  userMessage: string,
  ingredients: string,
  allergens: string[],
  dietaryPreferences: string[],
  medicalConditions: string[]
) => {
  return `
User has the following details:
Allergies: ${allergens.join(", ") || "None"}
Dietary Preferences: ${dietaryPreferences.join(", ") || "None"}
Health Conditions: ${medicalConditions.join(", ") || "None"}

Extracted Ingredients:
${ingredients || "None provided"}

User's question: "${userMessage}"

Check if any ingredient conflicts with the user's conditions. If the question is unrelated, respond accordingly.
`.trim();
};


export const fetchChatResponse = async (prompt: string): Promise<string> => {
  const key = import.meta.env.VITE_OPENROUTER_API_KEY;
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'qwen/qwen3-235b-a22b-07-25:free',
      messages: [
        { role: 'system', content: SYSTEM_MESSAGE },
        { role: 'user', content: prompt },
      ],
    }),
  });
  //console.log(key);
  const data = await response.json();
  console.log(data);
  return data?.choices?.[0]?.message?.content ?? 'Sorry, I could not understand that.';
};
