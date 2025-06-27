export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface MessageType {
  id: string;
  content: string;
  sender: 'user' | 'n8n';
  timestamp: Date;
}

export interface ChatSidebarProps {
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
}

export interface ChatInterfaceProps {
  chatSessionId: string;
}

export interface ChatSessionItemProps {
  session: ChatSession;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export interface ChatMessageProps {
  message: MessageType;
}

export interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  className?: string;
}
