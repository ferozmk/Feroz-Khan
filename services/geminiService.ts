import { GoogleGenAI, Chat, GenerateContentParameters, Modality } from "@google/genai";

let ai: GoogleGenAI | null = null;

// Returns a singleton instance of the GoogleGenAI client.
const getAiClient = (): GoogleGenAI => {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

// Creates a new, stateful chat session.
export const createChatSession = (): Chat => {
  const client = getAiClient();
  return client.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are FerozAI, a helpful AI assistant. Always respond in the same language and script the user writes in (Urdu, Roman Urdu, Hindi, English). If the user types in Roman Urdu, you must also reply in Roman Urdu. Give clear, direct, and relevant answers — only respond to what the user asks. Keep the tone helpful, natural, and fact-based, like ChatGPT or Gemini. Do not mention your creator, background, or add extra details unless the user specifically asks. If the user’s request is unclear, ask a short follow-up question for clarification. Use markdown for formatting where appropriate to enhance readability.`,
    },
  });
};

// Simplified stream function for better performance and reliability.
// It directly sends the user's message to the ongoing chat session.
export const sendMessageStream = async function* (chat: Chat, message: string) {
    if (!chat) {
        throw new Error("Chat session not provided.");
    }
    const stream = await chat.sendMessageStream({ message });
    for await (const chunk of stream) {
        yield chunk;
    }
};

// Centralized image generation function
export const generateImages = async (prompt: string) => {
    const ai = getAiClient();
    return await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
        },
    });
};

// Centralized image editing function (generic generateContent)
export const generateContent = async (params: GenerateContentParameters) => {
    const ai = getAiClient();
    return await ai.models.generateContent(params);
};

// Centralized video generation functions
export const generateVideo = async (prompt: string) => {
    const ai = getAiClient();
    return await ai.models.generateVideos({
        model: 'veo-2.0-generate-001',
        prompt: prompt,
        config: {
            numberOfVideos: 1
        }
    });
};

export const getVideosOperation = async (operation: any) => {
    const ai = getAiClient();
    return await ai.operations.getVideosOperation({ operation: operation });
};