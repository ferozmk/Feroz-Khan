
import { GoogleGenAI, Chat } from "@google/genai";

let chat: Chat | null = null;

export const startChat = () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: 'You are FerozAI, a helpful and friendly assistant. Your responses should be informative and engaging. Format your responses with markdown where appropriate for better readability.',
    },
  });
};

export const sendMessageStream = async (message: string) => {
  if (!chat) {
    throw new Error("Chat not initialized. Call startChat first.");
  }
  return await chat.sendMessageStream({ message });
};
