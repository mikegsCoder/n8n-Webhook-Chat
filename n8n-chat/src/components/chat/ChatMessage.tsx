import { ChatMessageProps } from "../../interfaces/chat";
import { UserIcon, BotIcon } from "lucide-react";

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.sender === "user";

  const formatContent = (content: string) => {
    if (isUser) return content;
    
    let formattedContent = content;
    
    // Handle numbered lists
    formattedContent = formattedContent.replace(/(\d+)\.\s+(.*$)/gm, '<div class="mb-1">$1. $2</div>');
    
    // Handle bullet points
    formattedContent = formattedContent.replace(/^-\s+(.*$)/gm, '<div class="mb-1 ml-2">• $1</div>');
    formattedContent = formattedContent.replace(/^‣\s+(.*$)/gm, '<div class="mb-1 ml-2 font-medium">• $1</div>');
    
    // Replace multiple consecutive newlines with appropriate spacing
    formattedContent = formattedContent.replace(/\n{2,}/g, '<div class="h-4"></div>');
    
    // Replace single newlines with simple breaks
    formattedContent = formattedContent.replace(/\n/g, '<br/>');
    
    // Make text sections more legible
    formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, '<span class="font-medium">$1</span>');
    
    return formattedContent;
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
          <BotIcon size={16} className="text-white" />
        </div>
      )}
      
      <div className={`max-w-[70%] ${isUser ? 'order-first' : ''}`}>
        <div
          className={`p-3 rounded-lg ${
            isUser
              ? 'bg-blue-600 text-white ml-auto'
              : 'bg-gray-100 text-gray-900'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
            />
          )}
        </div>
        <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
      
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
          <UserIcon size={16} className="text-white" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
