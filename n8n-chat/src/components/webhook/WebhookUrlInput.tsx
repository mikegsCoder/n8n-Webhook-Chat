import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { TestTubeIcon, CheckCircleIcon, XCircleIcon, AlertTriangleIcon } from "lucide-react";

interface WebhookUrlInputProps {
  webhookUrl: string;
  onWebhookUrlChange: (url: string) => void;
  connectionStatus: "unchecked" | "success" | "error" | "cors-limited";
  onTestConnection: () => void;
  ignoreSSLErrors: boolean;
  onIgnoreSSLErrorsChange: (ignore: boolean) => void;
  isLoading: boolean;
}

const WebhookUrlInput = ({
  webhookUrl,
  onWebhookUrlChange,
  connectionStatus,
  onTestConnection,
  ignoreSSLErrors,
  onIgnoreSSLErrorsChange,
  isLoading,
}: WebhookUrlInputProps) => {
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    await onTestConnection();
    setIsTestingConnection(false);
  };

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case "success":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircleIcon size={12} className="mr-1" />
            Connected
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive">
            <XCircleIcon size={12} className="mr-1" />
            Connection Failed
          </Badge>
        );
      case "cors-limited":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <AlertTriangleIcon size={12} className="mr-1" />
            CORS Limited
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="webhook-url" className="block text-sm font-medium text-gray-700 mb-2">
          n8n Webhook URL
        </label>
        <div className="flex gap-2">
          <Input
            id="webhook-url"
            type="url"
            value={webhookUrl}
            onChange={(e) => onWebhookUrlChange(e.target.value)}
            placeholder="https://your-n8n-instance.com/webhook/your-webhook-id"
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            type="button"
            onClick={handleTestConnection}
            disabled={!webhookUrl || isTestingConnection || isLoading}
            variant="outline"
            className="whitespace-nowrap"
          >
            <TestTubeIcon size={16} className="mr-2" />
            {isTestingConnection ? "Testing..." : "Test"}
          </Button>
        </div>
        
        {connectionStatus !== "unchecked" && (
          <div className="mt-2 flex items-center gap-2">
            {getStatusBadge()}
            {connectionStatus === "cors-limited" && (
              <span className="text-sm text-gray-600">
                Connection limited by CORS policy
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="ignore-ssl"
          checked={ignoreSSLErrors}
          onCheckedChange={onIgnoreSSLErrorsChange}
          disabled={isLoading}
        />
        <label
          htmlFor="ignore-ssl"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Ignore SSL certificate errors
        </label>
      </div>

      <div className="text-sm text-gray-600">
        <p className="mb-1">
          <strong>Note:</strong> Enter your n8n webhook URL to start sending messages.
        </p>
        <p>
          If you encounter SSL errors, you can enable "Ignore SSL errors" above.
        </p>
      </div>
    </div>
  );
};

export default WebhookUrlInput;
