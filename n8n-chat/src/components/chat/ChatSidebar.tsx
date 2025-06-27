import { useState, useEffect } from "react";
import { ChatSidebarProps, ChatSession } from "../../interfaces/chat";
import { getChatSessions, createChatSession, deleteChatSession } from "../../services/chatService";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatSidebarHeader from "./ChatSidebarHeader";
import ChatSessionList from "./ChatSessionList";

const ChatSidebar = ({ 
  currentChatId, 
  onSelectChat, 
  onNewChat 
}: ChatSidebarProps) => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadChatSessions = async () => {
    setIsLoading(true);
    try {
      const sessions = await getChatSessions();
      setChatSessions(sessions);
    } catch (error) {
      console.error("Error loading chat sessions:", error);
      toast({
        title: "Error",
        description: "Failed to load chat sessions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChatSessions();
  }, []);

  const handleNewChat = async () => {
    const newSession = await createChatSession();
    if (newSession) {
      setChatSessions(prev => [newSession, ...prev]);
      onSelectChat(newSession.id);
      onNewChat();
      toast({
        title: "Success",
        description: "New chat created successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to create a new chat",
        variant: "destructive",
      });
    }
  };

  const handleDeleteChat = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (chatSessions.length === 1) {
      toast({
        title: "Cannot Delete",
        description: "You must have at least one chat session",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const success = await deleteChatSession(id);
      
      if (success) {
        setChatSessions(prev => prev.filter(session => session.id !== id));
        
        toast({
          title: "Success",
          description: "Chat deleted successfully",
        });
        
        if (currentChatId === id) {
          const remainingChats = chatSessions.filter(chat => chat.id !== id);
          if (remainingChats.length > 0) {
            onSelectChat(remainingChats[0].id);
          } else {
            handleNewChat();
          }
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to delete chat",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the chat",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="border-r border-gray-200 w-64 h-full bg-white flex flex-col">
      <ChatSidebarHeader onNewChat={handleNewChat} />
      
      <ScrollArea className="flex-1 p-2">
        <ChatSessionList 
          isLoading={isLoading}
          chatSessions={chatSessions}
          currentChatId={currentChatId}
          onSelectChat={onSelectChat}
          onDeleteChat={handleDeleteChat}
        />
      </ScrollArea>
    </div>
  );
};

export default ChatSidebar;
