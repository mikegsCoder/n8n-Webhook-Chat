import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

interface ChatSidebarHeaderProps {
  onNewChat: () => void;
}

const ChatSidebarHeader = ({ onNewChat }: ChatSidebarHeaderProps) => {
  return (
    <div className="p-4 border-b border-gray-200 bg-blue-50">
      <Button 
        onClick={onNewChat}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        <PlusIcon size={16} className="mr-2" />
        New Chat
      </Button>
    </div>
  );
};

export default ChatSidebarHeader;
