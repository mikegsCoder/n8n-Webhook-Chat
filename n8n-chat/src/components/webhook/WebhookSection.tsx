import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDownIcon, ChevronUpIcon, LinkIcon } from "lucide-react";
import WebhookUrlInput from "./WebhookUrlInput";

interface WebhookSectionProps {
  webhookUrl: string;
  onWebhookUrlChange: (url: string) => void;
  connectionStatus: "unchecked" | "success" | "error" | "cors-limited";
  onTestConnection: () => void;
  ignoreSSLErrors: boolean;
  onIgnoreSSLErrorsChange: (ignore: boolean) => void;
  isLoading: boolean;
  isWebhookSectionOpen: boolean;
  setIsWebhookSectionOpen: (open: boolean) => void;
}

const WebhookSection = ({
  webhookUrl,
  onWebhookUrlChange,
  connectionStatus,
  onTestConnection,
  ignoreSSLErrors,
  onIgnoreSSLErrorsChange,
  isLoading,
  isWebhookSectionOpen,
  setIsWebhookSectionOpen,
}: WebhookSectionProps) => {
  return (
    <Collapsible open={isWebhookSectionOpen} onOpenChange={setIsWebhookSectionOpen} className="flex-shrink-0">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded-md">
        <div className="flex items-center gap-2">
          <LinkIcon size={16} />
          <span className="font-medium">Webhook Configuration</span>
        </div>
        {isWebhookSectionOpen ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
      </CollapsibleTrigger>
      <CollapsibleContent className="p-2">
        <WebhookUrlInput
          webhookUrl={webhookUrl}
          onWebhookUrlChange={onWebhookUrlChange}
          connectionStatus={connectionStatus}
          onTestConnection={onTestConnection}
          ignoreSSLErrors={ignoreSSLErrors}
          onIgnoreSSLErrorsChange={onIgnoreSSLErrorsChange}
          isLoading={isLoading}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};

export default WebhookSection;
