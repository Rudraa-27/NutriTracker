import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const analyzeFood = async (foodText) => {
  const prompt = `
Analyze the following food consumption input:

"${foodText}"

Break it down into individual food items.

For each item, estimate nutritional values using standard
portion sizes.

Return only valid JSON matching the provided schema.

Important:
- foodName should be a clean food name.
- calories should be in kcal.
- protein, carbs, and fats should be in grams.
- Use numeric values only.
- Do not include explanations outside the JSON.
`;

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL,
    contents: prompt,

    config: {
      responseMimeType: "application/json",

      responseSchema: {
        type: "array",

        items: {
          type: "object",

          properties: {
            foodName: {
              type: "string"
            },

            calories: {
              type: "number"
            },

            protein: {
              type: "number"
            },

            carbs: {
              type: "number"
            },

            fats: {
              type: "number"
            }
          },

          required: [
            "foodName",
            "calories",
            "protein",
            "carbs",
            "fats"
          ]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch {
    throw new Error("Gemini returned invalid nutrition data");
  }
};

export default analyzeFood;