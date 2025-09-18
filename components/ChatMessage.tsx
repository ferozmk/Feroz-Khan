import React from 'react';
import { Message, Role } from '../types';
import { UserIcon } from './icons/UserIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { marked } from 'marked';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  const createMarkup = (content: string) => {
    if (!isUser) {
        try {
            return { __html: marked.parse(content) };
        } catch (error) {
            console.error("Markdown parsing error:", error);
            return { __html: content };
        }
    }
    return { __html: content };
  };

  return (
    <div className={`flex items-start gap-4 p-5 ${isUser ? '' : 'bg-gray-100 dark:bg-gray-800/50'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-indigo-500' : 'bg-green-500'}`}>
        {isUser ? <UserIcon className="w-5 h-5 text-white" /> : <SparklesIcon className="w-5 h-5 text-white" />}
      </div>
      <div className="flex-1 pt-1">
        <p className="font-bold text-gray-800 dark:text-gray-200 mb-1">{isUser ? 'You' : 'FerozAI'}</p>
        <div 
          className="text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none prose-p:my-2 prose-li:my-1 prose-pre:bg-gray-200 dark:prose-pre:bg-gray-900 prose-pre:p-4 prose-pre:rounded-md" 
          dangerouslySetInnerHTML={createMarkup(message.content)} 
        />
      </div>
    </div>
  );
};

export default ChatMessage;
