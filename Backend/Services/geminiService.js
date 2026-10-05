import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const analyzeFood = async (foodText) => {
  const prompt = `
You are the nutrition analysis engine for NutriTrack.

Analyze the user's food description and convert it into individual food items
with estimated nutritional values.

USER INPUT:
"${foodText}"

IMPORTANT INSTRUCTIONS:

1. The input is free-form natural language.
   Do NOT require the user to use grams or milliliters.

2. Always try to understand quantities and portions.

3. Support all of these quantity formats:
   - grams: 250g chicken
   - kilograms: 1 kg rice
   - milliliters: 200 ml milk
   - pieces/counts: 2 eggs, 3 bananas
   - household portions: 1 glass milk, 1 bowl rice,
     1 cup dal, 2 rotis, 1 plate pasta
   - fractions: half a bowl rice, 1/2 cup curd
   - written numbers: two eggs, one glass milk
   - approximate descriptions: a handful of almonds,
     a plate of biryani

4. Understand preparation methods when provided:
   boiled, fried, grilled, roasted, steamed, baked, raw, etc.

5. If the user provides a quantity, estimate nutrition for the
   ENTIRE quantity they entered.

   Example:
   "2 eggs"
   means nutrition for 2 eggs, NOT 1 egg.

6. If the user provides a household measurement such as
   "1 glass", "1 bowl", "1 cup", "1 plate", or "1 tablespoon",
   estimate a reasonable standard serving size.

7. Never reject an input simply because the portion is not expressed
   in grams or milliliters.

8. If the input contains multiple foods, return one object for each
   identifiable food item.

   Example:
   "2 eggs and 2 slices of toast"
   should produce separate entries for:
   - eggs
   - toast

9. If the food is unfamiliar, make a reasonable nutritional estimate
   rather than returning an empty result.

10. Return numeric values only for calories, protein, carbs and fats.

11. Do not include explanations, markdown or extra text outside the JSON.

12. Use the most reasonable standard serving assumptions when exact
    quantity information is unavailable.

Return a JSON array matching the required schema.
`;

  try {
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-3.8-flash",

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

  if (!response.text) {
    throw new Error("Gemini returned an empty response");
  }

  const parsedData = JSON.parse(response.text);

  if (!Array.isArray(parsedData)) {
    throw new Error("Gemini response is not an array");
  }

  return parsedData;

} catch (error) {
  console.error("Gemini API error:", error);

  const status = error?.status || error?.code;
  const message = error?.message || "";

  if (
    status === 429 ||
    message.includes("RESOURCE_EXHAUSTED") ||
    message.includes("quota")
  ) {
    const quotaError = new Error(
      "Gemini API quota has been exceeded. Please try again after the quota resets."
    );

    quotaError.statusCode = 429;

    throw quotaError;
  }

  throw new Error("Unable to analyze food right now.");
}
};

export default analyzeFood;