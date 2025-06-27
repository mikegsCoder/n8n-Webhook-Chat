import { MessageType } from "../../interfaces/chat";
import { saveMessage } from "../../services/chatService";
import { useToast } from "@/hooks/use-toast";

interface MessageProcessorProps {
  webhookUrl: string;
  chatSessionId: string;
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  setIsLoading: (loading: boolean) => void;
}

export const useMessageProcessor = ({ webhookUrl, chatSessionId, setMessages, setIsLoading }: MessageProcessorProps) => {
  const { toast } = useToast();

  const extractSecondQuotationContent = (text: string): string => {
    // Find all quoted content using various quotation marks
    const quotationRegex = /["'""]([^"'""]*)["'"]/g;
    const matches = [];
    let match;
    
    while ((match = quotationRegex.exec(text)) !== null) {
      matches.push(match[1]);
    }
    
    // Return the second quotation content if it exists
    if (matches.length >= 2) {
      return matches[1];
    }
    
    // Fallback: return the original text if less than 2 quotations found
    return text;
  };

  const handleSendMessage = async (content: string) => {
    if (!webhookUrl) {
      toast({
        title: "No Webhook URL",
        description: "Please enter an n8n webhook URL to continue",
        variant: "destructive",
      });
      return;
    }

    const userMessage: MessageType = {
      id: crypto.randomUUID(),
      content,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    await saveMessage(chatSessionId, userMessage);
    
    setIsLoading(true);

    const waitingId = crypto.randomUUID();

    try {
      console.log("Sending message to n8n webhook:", webhookUrl);
      console.log("Message content:", content);
      
      const waitingMessage: MessageType = {
        id: waitingId,
        content: "🔄 Sending to n8n workflow...",
        sender: "n8n",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, waitingMessage]);
      
      const requestBody = { 
        message: content,
        timestamp: new Date().toISOString(),
        source: "n8n-chat-interface",
        chatId: chatSessionId
      };

      console.log("Request body:", JSON.stringify(requestBody, null, 2));

      const requestOptions: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json, text/plain, */*",
        },
        body: JSON.stringify(requestBody),
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout
      requestOptions.signal = controller.signal;
      
      let response;
      let responseContent = "";
      
      try {
        response = await fetch(webhookUrl, requestOptions);
        clearTimeout(timeoutId);
        
        console.log("Response status:", response.status);
        console.log("Response headers:", Object.fromEntries(response.headers.entries()));

        if (response.ok) {
          try {
            const responseText = await response.text();
            console.log("Raw response:", responseText);
            
            if (responseText) {
              // Try to parse as JSON first
              try {
                const jsonResponse = JSON.parse(responseText);
                const rawContent = jsonResponse.message || jsonResponse.response || JSON.stringify(jsonResponse, null, 2);
                
                // Extract content from second quotation
                responseContent = extractSecondQuotationContent(rawContent);
              } catch {
                // If not JSON, extract from text directly
                responseContent = extractSecondQuotationContent(responseText);
              }
            } else {
              responseContent = "✅ Message sent successfully to n8n workflow";
            }
          } catch (parseError) {
            console.warn("Failed to read response body:", parseError);
            responseContent = "✅ Message sent successfully (response body unreadable)";
          }
        } else {
          responseContent = `❌ Webhook returned error: ${response.status} ${response.statusText}`;
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        console.error("Fetch error:", fetchError);
        
        if (fetchError instanceof Error) {
          if (fetchError.name === 'AbortError') {
            responseContent = "⏱️ Request timed out (30s). Your message may have been processed by n8n.";
          } else if (fetchError.message.includes('CORS')) {
            responseContent = "✅ Message sent to n8n workflow!\n\n⚠️ Response blocked by browser CORS policy.\n\nTo receive n8n responses:\n1. Configure CORS in your n8n workflow\n2. Add these headers to your n8n HTTP Response node:\n   - Access-Control-Allow-Origin: *\n   - Access-Control-Allow-Headers: Content-Type\n   - Access-Control-Allow-Methods: POST, OPTIONS";
          } else {
            responseContent = `❌ Network error: ${fetchError.message}`;
          }
        } else {
          responseContent = "❌ Unknown network error occurred";
        }
      }

      // Remove waiting message
      setMessages(prev => prev.filter(msg => msg.id !== waitingId));

      const n8nMessage: MessageType = {
        id: crypto.randomUUID(),
        content: responseContent,
        sender: "n8n",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, n8nMessage]);
      await saveMessage(chatSessionId, n8nMessage);

    } catch (error) {
      // Remove waiting message on error
      setMessages(prev => prev.filter(msg => msg.id !== waitingId));
      
      console.error("Error in handleSendMessage:", error);
      
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      const errorN8nMessage: MessageType = {
        id: crypto.randomUUID(),
        content: `❌ Failed to send message: ${errorMessage}`,
        sender: "n8n",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorN8nMessage]);
      await saveMessage(chatSessionId, errorN8nMessage);

      toast({
        title: "Send Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSendMessage };
};
