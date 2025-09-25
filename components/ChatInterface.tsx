import React, { useState, useEffect, useRef } from 'react';
import { Message, Role } from '../types';
import { createChatSession, sendMessageStream } from '../services/geminiService';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import { SparklesIcon } from './icons/SparklesIcon';
import { Chat } from '@google/genai';
import { BookmarkIcon } from './icons/BookmarkIcon';
import firebase from '../services/firebase';

interface ChatInterfaceProps {
  user: firebase.User | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [saveStatus, setSaveStatus] = useState('Save Chat');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize a new, isolated chat session when the component mounts.
    try {
      const session = createChatSession();
      setChatSession(session);
      setMessages([
        { role: Role.MODEL, content: "Hello! I'm FerozAI. How can I help you today?" }
      ]);
      setError(null);
    } catch (e) {
      const err = e as Error;
      setError(`Initialization failed: ${err.message}`);
      console.error(err);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (userInput: string) => {
    if (!chatSession) {
      setError("Chat session is not ready. Please try again.");
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    const userMessage: Message = { role: Role.USER, content: userInput };
    setMessages(prev => [...prev, userMessage, { role: Role.MODEL, content: '' }]);

    try {
      // Pass the component's chat session to the service function.
      const stream = await sendMessageStream(chatSession, userInput);
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

  const handleSaveChat = () => {
    if (!user) {
      setError('You must be logged in to save chats.');
      return;
    }

    if (messages.length <= 1) {
      setSaveStatus('Cannot save empty chat');
      setTimeout(() => setSaveStatus('Save Chat'), 2000);
      return;
    }

    try {
      const storageKey = `userChats_${user.uid}`;
      const existingChatsRaw = localStorage.getItem(storageKey);
      const existingChats = existingChatsRaw ? JSON.parse(existingChatsRaw) : [];
      
      const newChat = {
        id: `chat_${Date.now()}`,
        messages,
        timestamp: Date.now(),
      };

      // Prepend the new chat to the beginning of the array
      const updatedChats = [newChat, ...existingChats];

      localStorage.setItem(storageKey, JSON.stringify(updatedChats));
      
      setSaveStatus('Saved!');
      setTimeout(() => setSaveStatus('Save Chat'), 2000);

    } catch (err) {
      console.error("Failed to save chat to local storage:", err);
      const errorMessage = `Failed to save chat: ${err instanceof Error ? err.message : 'An unknown error occurred'}`;
      setError(errorMessage);
      setSaveStatus('Save Failed');
      setTimeout(() => setSaveStatus('Save Chat'), 2000);
    }
  };
  
  return (
    <>
      <main className="flex-1 overflow-y-auto relative">
        {/* Save Chat Button Area */}
        {messages.length > 1 && (
            <div className="sticky top-0 z-10 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm max-w-4xl mx-auto flex justify-end p-2 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={handleSaveChat}
                    disabled={saveStatus !== 'Save Chat'}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                    aria-label="Save current chat"
                >
                    <BookmarkIcon className="w-4 h-4" />
                    {saveStatus}
                </button>
            </div>
        )}
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
      </footer>
    </>
  );
};

export default ChatInterface;