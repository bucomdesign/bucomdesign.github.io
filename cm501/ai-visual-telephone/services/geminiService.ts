import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// We assume process.env.API_KEY is available as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash-image'; 
    
    // Append keywords to enforce photorealistic style regardless of student input nuances
    const enhancedPrompt = `${prompt}, photorealistic, realistic photograph, 8k, highly detailed, sharp focus, cinematic lighting`;

    // We strictly use the generateContent method as instructed for nano banana models
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            text: enhancedPrompt,
          },
        ],
      },
      config: {
        // Nano banana models do not support responseMimeType or specific imageConfig for size in the standard way
        // We rely on defaults. Ideally we would use 'gemini-3-pro-image-preview' for 1K/2K/4K if needed.
        // For this demo, flash-image is faster and sufficient.
      },
    });

    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const base64EncodeString = part.inlineData.data;
          // Determine mimeType. The API usually returns image/png or image/jpeg. 
          // We can check part.inlineData.mimeType or default to png.
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${base64EncodeString}`;
        }
      }
    }
    
    throw new Error("No image data found in response");

  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};