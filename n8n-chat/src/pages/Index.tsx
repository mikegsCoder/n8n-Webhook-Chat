import { useState, useEffect } from "react";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatInterface from "../components/chat/ChatInterface";
import { getChatSessions, createChatSession } from "../services/chatService";

const Index = () => {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const handleNewChat = () => {
    // This function is called when a new chat is created
    // The ChatSidebar component handles the actual creation and selection
  };

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const sessions = await getChatSessions();
        
        if (sessions.length > 0) {
          setCurrentChatId(sessions[0].id);
        } else {
          const newSession = await createChatSession();
          if (newSession) {
            setCurrentChatId(newSession.id);
          }
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
        // Try to create a new session as fallback
        const newSession = await createChatSession();
        if (newSession) {
          setCurrentChatId(newSession.id);
        }
      } finally {
        setIsInitializing(false);
      }
    };

    initializeChat();
  }, []);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-blue-800">n8n Webhook Chat</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            This interface allows you to interact with n8n workflows through webhooks. 
            Enter your webhook URL, send messages, and view responses from your n8n workflows.
          </p>
        </div>
        
        <div className="flex bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: "80vh" }}>
          <ChatSidebar 
            currentChatId={currentChatId} 
            onSelectChat={setCurrentChatId}
            onNewChat={handleNewChat}
          />
          
          <div className="flex-1">
            {currentChatId ? (
              <ChatInterface chatSessionId={currentChatId} key={currentChatId} />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading chat...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
