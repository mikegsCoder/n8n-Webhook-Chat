import { useEffect, useRef } from "react";
import { MessageType } from "../../interfaces/chat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDownIcon, ChevronUpIcon, MessageSquareIcon } from "lucide-react";
import ChatMessage from "./ChatMessage";

interface ChatSectionProps {
  messages: MessageType[];
  isChatSectionOpen: boolean;
  setIsChatSectionOpen: (open: boolean) => void;
}

const ChatSection = ({
  messages,
  isChatSectionOpen,
  setIsChatSectionOpen,
}: ChatSectionProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Collapsible open={isChatSectionOpen} onOpenChange={setIsChatSectionOpen} className="flex-1 flex flex-col mt-4 min-h-0">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded-md flex-shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquareIcon size={16} />
          <span className="font-medium">Chat Messages ({messages.length})</span>
        </div>
        {isChatSectionOpen ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
      </CollapsibleTrigger>
      <CollapsibleContent className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1 border rounded-md">
          <div className="p-4 space-y-2">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquareIcon size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No messages yet</p>
                <p className="text-sm">Send your first message to get started!</p>
              </div>
            ) : (
              messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ChatSection;
