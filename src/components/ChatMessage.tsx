import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isUser = role === "user";
  
  return (
    <div className={cn(
      "flex gap-3 p-4 fade-in",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "flex gap-3 max-w-[80%]",
        isUser && "flex-row-reverse"
      )}>
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded border flex items-center justify-center text-sm font-bold",
          isUser 
            ? "bg-secondary/20 border-secondary text-secondary" 
            : "bg-primary/20 border-primary text-primary border-glow"
        )}>
          {isUser ? ">" : "AI"}
        </div>
        <div className={cn(
          "rounded-lg px-4 py-3 border",
          isUser 
            ? "bg-secondary/10 border-secondary/30" 
            : "bg-card border-border border-glow"
        )}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap font-mono">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};
