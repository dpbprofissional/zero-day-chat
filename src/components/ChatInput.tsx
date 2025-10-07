import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="container max-w-4xl mx-auto p-4">
        <div className="flex gap-2 items-end">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your command..."
            disabled={disabled}
            className="min-h-[60px] max-h-[200px] resize-none bg-input border-border focus:border-primary focus:border-glow font-mono text-sm"
          />
          <Button
            type="submit"
            disabled={!input.trim() || disabled}
            size="icon"
            className="h-[60px] w-[60px] bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 font-mono">
          Press <span className="text-primary">Enter</span> to send, <span className="text-primary">Shift+Enter</span> for new line
        </p>
      </div>
    </form>
  );
};
