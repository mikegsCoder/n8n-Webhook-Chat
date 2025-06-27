import { useState, useEffect } from "react";
import { ChatInterfaceProps, MessageType } from "../../interfaces/chat";
import { getChatMessages } from "../../services/chatService";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ChatInput from "./ChatInput";
import WebhookSection from "../webhook/WebhookSection";
import ChatSection from "./ChatSection";
import { useConnectionTestManager } from "../connection/ConnectionTestManager";
import { useMessageProcessor } from "../message/MessageProcessor";

const ChatInterface = ({ chatSessionId }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<"unchecked" | "success" | "error" | "cors-limited">("unchecked");
  const [ignoreSSLErrors, setIgnoreSSLErrors] = useState(false);
  const [isWebhookSectionOpen, setIsWebhookSectionOpen] = useState(true);
  const [isChatSectionOpen, setIsChatSectionOpen] = useState(true);
  const { toast } = useToast();

  const { testConnection } = useConnectionTestManager({ webhookUrl, setConnectionStatus });
  const { handleSendMessage } = useMessageProcessor({ 
    webhookUrl, 
    chatSessionId, 
    setMessages, 
    setIsLoading 
  });

  const loadMessages = async () => {
    if (!chatSessionId) return;
    
    try {
      const chatMessages = await getChatMessages(chatSessionId);
      setMessages(chatMessages);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast({
        title: "Error",
        description: "Failed to load chat messages",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (chatSessionId) {
      loadMessages();
    }
  }, [chatSessionId]);

  return (
    <Card className="w-full h-full shadow-none border-none rounded-none flex flex-col">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">n8n Webhook Chat</h2>
          <div className="text-sm opacity-90">
            Chat Session: {chatSessionId.slice(0, 8)}...
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 flex flex-col flex-1 min-h-0">
        <WebhookSection
          webhookUrl={webhookUrl}
          onWebhookUrlChange={setWebhookUrl}
          connectionStatus={connectionStatus}
          onTestConnection={testConnection}
          ignoreSSLErrors={ignoreSSLErrors}
          onIgnoreSSLErrorsChange={setIgnoreSSLErrors}
          isLoading={isLoading}
          isWebhookSectionOpen={isWebhookSectionOpen}
          setIsWebhookSectionOpen={setIsWebhookSectionOpen}
        />
        
        <ChatSection
          messages={messages}
          isChatSectionOpen={isChatSectionOpen}
          setIsChatSectionOpen={setIsChatSectionOpen}
        />

        <ChatInput 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading} 
          className="mt-4 flex-shrink-0" 
        />
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
