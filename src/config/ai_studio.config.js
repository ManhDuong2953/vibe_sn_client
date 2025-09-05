import { GoogleGenerativeAI } from "@google/generative-ai";

const KEY_AI = import.meta.env.VITE_API_KEY_GOOGLE_AI;

// Hàm generateContent nhận vào prompt và trả về kết quả
async function generateContent(prompt) {
  try {
    const genAI = new GoogleGenerativeAI(KEY_AI);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);

    // Trả về kết quả nếu có
    return result.response.candidates[0].content.parts[0].text
      ;
  } catch (error) {
    console.error("Error:", error.message || error);
    throw new Error("Failed to generate content");
  }
}

export default generateContent;
