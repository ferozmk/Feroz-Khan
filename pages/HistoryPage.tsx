import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/PageWrapper';
import { useAuth } from '../hooks/useAuth';
import { Message, Role } from '../types';

interface SavedChat {
  id: string;
  timestamp: number;
  messages: Message[];
}

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg animate-pulse">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mt-2"></div>
      </div>
    ))}
  </div>
);

const HistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState<SavedChat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (!user) {
      setIsLoading(false);
      setChats([]);
      return;
    }

    try {
      const storageKey = `userChats_${user.uid}`;
      const savedChatsRaw = localStorage.getItem(storageKey);
      if (savedChatsRaw) {
        const savedChats: SavedChat[] = JSON.parse(savedChatsRaw);
        // The chats are already saved with newest first.
        setChats(savedChats);
      } else {
        setChats([]);
      }
    } catch (error) {
        console.error("Failed to load chats from local storage:", error);
        setChats([]);
    } finally {
        setIsLoading(false);
    }
    // Re-run when user changes.
  }, [user]);

  const getChatTitle = (messages: Message[]) => {
    const firstUserMessage = messages.find(m => m.role === Role.USER);
    return firstUserMessage ? firstUserMessage.content : 'Chat Conversation';
  };

  return (
    <PageWrapper title="Chat History">
      {isLoading ? (
        <LoadingSkeleton />
      ) : chats.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            You have no saved chats.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Click the 'Save Chat' button in a conversation to store it here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {chats.map(chat => (
            <div 
              key={chat.id} 
              className="p-4 bg-white dark:bg-gray-800/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow"
              role="button"
              tabIndex={0}
              aria-label={`View chat saved on ${new Date(chat.timestamp).toLocaleString()}`}
            >
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 truncate pr-4" title={getChatTitle(chat.messages)}>
                {getChatTitle(chat.messages)}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Saved on: {new Date(chat.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

export default HistoryPage;