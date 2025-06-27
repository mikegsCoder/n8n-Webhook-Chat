import { useToast } from "@/hooks/use-toast";

interface ConnectionTestManagerProps {
  webhookUrl: string;
  setConnectionStatus: (status: "unchecked" | "success" | "error" | "cors-limited") => void;
}

export const useConnectionTestManager = ({ webhookUrl, setConnectionStatus }: ConnectionTestManagerProps) => {
  const { toast } = useToast();

  const testConnection = async () => {
    if (!webhookUrl) {
      toast({
        title: "No Webhook URL",
        description: "Please enter a webhook URL to test",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Testing connection to:", webhookUrl);
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          test: true,
          message: "Connection test from n8n Webhook Chat",
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setConnectionStatus("success");
        toast({
          title: "Connection Successful",
          description: "Successfully connected to the webhook",
        });
      } else {
        setConnectionStatus("error");
        toast({
          title: "Connection Failed",
          description: `Failed to connect: ${response.status} ${response.statusText}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Connection test failed:", error);
      setConnectionStatus("cors-limited");
      toast({
        title: "Connection Test Limited",
        description: "CORS may block response reading, but webhook should work for sending messages",
        variant: "destructive",
      });
    }
  };

  return { testConnection };
};
