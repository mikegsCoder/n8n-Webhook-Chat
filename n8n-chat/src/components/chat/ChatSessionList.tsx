import { ChatSession } from "../../interfaces/chat";
import ChatSessionItem from "./ChatSessionItem";

interface ChatSessionListProps {
  isLoading: boolean;
  chatSessions: ChatSession[];
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (id: string, e: React.MouseEvent) => void;
}

const ChatSessionList = ({
  isLoading,
  chatSessions,
  currentChatId,
  onSelectChat,
  onDeleteChat,
}: ChatSessionListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded-md"></div>
          </div>
        ))}
      </div>
    );
  }

  if (chatSessions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-sm">No chat sessions yet.</p>
        <p className="text-xs mt-1">Click "New Chat" to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {chatSessions.map((session) => (
        <ChatSessionItem
          key={session.id}
          session={session}
          isActive={currentChatId === session.id}
          onSelect={onSelectChat}
          onDelete={onDeleteChat}
        />
      ))}
    </div>
  );
};

export default ChatSessionList;
