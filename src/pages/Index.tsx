import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Auth } from "@/components/Auth";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { Sidebar } from "@/components/Sidebar";
import { useChat } from "@/hooks/useChat";

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const {
    conversations,
    currentConversation,
    messages,
    isLoading,
    setCurrentConversation,
    createConversation,
    sendMessage,
    deleteConversation,
  } = useChat();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-primary font-mono text-glow terminal-cursor">Inicializando sistema neural</p>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar
        conversations={conversations}
        currentConversation={currentConversation}
        onSelectConversation={setCurrentConversation}
        onNewConversation={createConversation}
        onDeleteConversation={deleteConversation}
      />
      
      <div className="flex-1 flex flex-col">
        <ChatHeader />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container max-w-4xl mx-auto py-6">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground font-mono text-center">
                  Sistema neural pronto.<br />
                  Envie uma mensagem para começar.
                </p>
              </div>
            )}
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
                      Processando
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        <ChatInput onSend={sendMessage} disabled={isLoading || !currentConversation} />
      </div>
    </div>
  );
};

export default Index;
