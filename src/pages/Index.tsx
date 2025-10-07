import { useState } from "react";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "System initialized. Neural network online.\nHow can I assist you today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Processing request...\nI'm a demo interface. Connect me to an AI backend to enable real conversations.",
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ChatHeader />
      
      <main className="flex-1 overflow-y-auto">
        <div className="container max-w-4xl mx-auto py-6">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              content={message.content}
            />
          ))}
          {isLoading && (
            <div className="flex gap-3 p-4 fade-in">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded border bg-primary/20 border-primary border-glow flex items-center justify-center text-sm font-bold text-primary">
                  AI
                </div>
                <div className="rounded-lg px-4 py-3 border bg-card border-border border-glow">
                  <p className="text-sm font-mono text-primary terminal-cursor">
                    Thinking
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
};

export default Index;
