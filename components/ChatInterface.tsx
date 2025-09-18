import React, { useState, useEffect, useRef } from 'react';
import { Message, Role } from '../types';
import { startChat, sendMessageStream } from '../services/geminiService';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import { SparklesIcon } from './icons/SparklesIcon';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const initialize = () => {
     try {
      startChat();
      setMessages([
        { role: Role.MODEL, content: "Hello! I'm FerozAI. How can I help you today?" }
      ]);
      setError(null);
    } catch (e) {
      const err = e as Error;
      setError(`Initialization failed: ${err.message}`);
      console.error(err);
    }
  }

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (userInput: string) => {
    setError(null);
    setIsLoading(true);
    
    const userMessage: Message = { role: Role.USER, content: userInput };
    setMessages(prev => [...prev, userMessage, { role: Role.MODEL, content: '' }]);

    try {
      const stream = await sendMessageStream(userInput);
      let modelResponse = '';

      for await (const chunk of stream) {
        modelResponse += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = modelResponse;
          return newMessages;
        });
      }
    } catch (e) {
      const err = e as Error;
      const errorMessage = `An error occurred: ${err.message}`;
      setError(errorMessage);
      console.error(err);
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMsg = newMessages[newMessages.length - 1];
        if (lastMsg.role === Role.MODEL) {
          lastMsg.content = `Sorry, I ran into a problem: ${err.message}`;
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
          {isLoading && messages.length > 0 && messages[messages.length - 1].role === Role.USER && (
            <div className="flex items-start gap-4 p-5 bg-gray-100 dark:bg-gray-800/50">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <SparklesIcon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 pt-1">
                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1">FerozAI</p>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-75"></span>
                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-150"></span>
                    </div>
                </div>
            </div>
          )}
          {error && (
            <div className="p-5 text-center text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/50">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>

      <footer className="w-full">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        <p className="text-center text-xs text-gray-500 dark:text-gray-600 p-2">Powered by Google Gemini. UI design by Feroz.</p>
      </footer>
    </>
  );
};

export default ChatInterface;
