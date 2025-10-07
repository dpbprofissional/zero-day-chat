import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Auth } from "@/components/Auth";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ConversationList } from "@/components/ConversationList";
import { useConversation } from "@/hooks/useConversation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { messages, isLoading, sendMessage } = useConversation(conversationId);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        createOrLoadConversation();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        createOrLoadConversation();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const createOrLoadConversation = async () => {
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error loading conversation:", error);
      return;
    }

    if (data && data.length > 0) {
      setConversationId(data[0].id);
    } else {
      createNewConversation();
    }
  };

  const createNewConversation = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (!currentUser) return;

    const { data, error } = await supabase
      .from("conversations")
      .insert({ 
        title: "Nova conversa",
        user_id: currentUser.id 
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating conversation:", error);
      toast({
        title: "Erro",
        description: "Falha ao criar conversa",
        variant: "destructive",
      });
      return;
    }

    setConversationId(data.id);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setConversationId(null);
  };

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen flex bg-background">
      <ConversationList
        currentId={conversationId}
        onSelect={setConversationId}
        onCreate={createNewConversation}
      />

      <div className="flex-1 flex flex-col">
        <div className="border-b border-border bg-card/80 backdrop-blur-sm">
          <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <ChatHeader />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-primary"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="container max-w-4xl mx-auto py-6">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-lg text-primary text-glow mb-2">Sistema inicializado</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    Rede neural online. Como posso ajudar?
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role as "user" | "assistant"}
                  content={message.content}
                />
              ))
            )}
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

        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default Index;
