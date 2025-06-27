import { useState } from "react";
import { ChatSessionItemProps } from "../../interfaces/chat";
import { updateChatSession } from "../../services/chatService";
import { useToast } from "@/hooks/use-toast";
import { PencilIcon, Trash2, CheckIcon, XIcon } from "lucide-react";

const ChatSessionItem = ({
  session,
  isActive,
  onSelect,
  onDelete,
}: ChatSessionItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(session.title);
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const startEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const cancelEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditTitle(session.title);
    setIsEditing(false);
  };

  const saveTitle = async (e?: React.MouseEvent | React.FocusEvent) => {
    e?.stopPropagation();
    
    if (editTitle.trim() === "") {
      toast({
        title: "Error",
        description: "Chat title cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const success = await updateChatSession(session.id, { title: editTitle.trim() });
    
    if (success) {
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Chat title updated successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update chat title",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveTitle();
    }
    if (e.key === 'Escape') {
      e.stopPropagation();
      setEditTitle(session.title);
      setIsEditing(false);
    }
  };

  return (
    <div 
      onClick={() => !isActive && onSelect(session.id)}
      className={`p-2 rounded-md flex items-start justify-between cursor-pointer group transition-colors ${
        isActive ? 'bg-blue-100 hover:bg-blue-200' : 'hover:bg-gray-100'
      }`}
    >
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="text-sm border rounded px-1 py-0.5 w-full"
              autoFocus
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handleKeyDown}
              onBlur={saveTitle}
            />
            <button onClick={saveTitle} className="ml-1 text-green-600 hover:text-green-800">
              <CheckIcon size={14} />
            </button>
            <button onClick={cancelEditing} className="ml-1 text-gray-600 hover:text-gray-800">
              <XIcon size={14} />
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-sm font-medium truncate">{session.title}</h3>
            <p className="text-xs text-gray-500 truncate">
              {formatDate(session.created_at)}
            </p>
          </>
        )}
      </div>
      
      {!isEditing && (
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={startEditing}
            className="text-gray-600 hover:text-blue-600 p-1 flex items-center justify-center"
            title="Edit chat title"
            aria-label="Edit chat title"
          >
            <PencilIcon size={14} />
          </button>
          <button 
            onClick={(e) => onDelete(session.id, e)}
            className="text-gray-600 hover:text-red-600 p-1 flex items-center justify-center"
            aria-label="Delete chat"
            title="Delete chat"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatSessionItem;
