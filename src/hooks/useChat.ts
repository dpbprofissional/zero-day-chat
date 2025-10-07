import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export const useChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (currentConversation) {
      loadMessages(currentConversation);
      subscribeToMessages(currentConversation);
    }
  }, [currentConversation]);

  const loadConversations = async () => {
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error loading conversations:", error);
      return;
    }

    setConversations(data || []);
    if (data && data.length > 0 && !currentConversation) {
      setCurrentConversation(data[0].id);
    }
  };

  const loadMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading messages:", error);
      return;
    }

    setMessages((data || []) as Message[]);
  };

  const subscribeToMessages = (conversationId: string) => {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const createConversation = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("conversations")
      .insert({ user_id: user.id, title: "Nova conversa" })
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

    setConversations((prev) => [data, ...prev]);
    setCurrentConversation(data.id);
    setMessages([]);
  };

  const sendMessage = async (content: string) => {
    if (!currentConversation || !content.trim()) return;

    setIsLoading(true);

    try {
      // Save user message
      const { error: saveError } = await supabase.from("messages").insert({
        conversation_id: currentConversation,
        role: "user",
        content: content.trim(),
      });

      if (saveError) throw saveError;

      // Call edge function
      const { data, error } = await supabase.functions.invoke("chat", {
        body: {
          conversationId: currentConversation,
          message: content.trim(),
        },
      });

      if (error) throw error;

      // Save assistant message
      await supabase.from("messages").insert({
        conversation_id: currentConversation,
        role: "assistant",
        content: data.message,
      });

    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao enviar mensagem",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    const { error } = await supabase
      .from("conversations")
      .delete()
      .eq("id", conversationId);

    if (error) {
      console.error("Error deleting conversation:", error);
      return;
    }

    setConversations((prev) => prev.filter((c) => c.id !== conversationId));
    if (currentConversation === conversationId) {
      const remaining = conversations.filter((c) => c.id !== conversationId);
      setCurrentConversation(remaining[0]?.id || null);
    }
  };

  return {
    conversations,
    currentConversation,
    messages,
    isLoading,
    setCurrentConversation,
    createConversation,
    sendMessage,
    deleteConversation,
  };
};
