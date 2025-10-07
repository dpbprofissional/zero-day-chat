import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
}

export const useConversation = (conversationId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (conversationId) {
      loadMessages();
      subscribeToMessages();
    }
  }, [conversationId]);

  const loadMessages = async () => {
    if (!conversationId) return;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading messages:", error);
      return;
    }

    setMessages((data as Message[]) || []);
  };

  const subscribeToMessages = () => {
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

  const sendMessage = async (content: string) => {
    if (!conversationId || !content.trim()) return;

    setIsLoading(true);

    try {
      // Save user message
      const { error: userMsgError } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        role: "user",
        content: content.trim(),
      });

      if (userMsgError) throw userMsgError;

      // Get all messages for context
      const { data: allMessages } = await supabase
        .from("messages")
        .select("role, content")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      // Call AI function
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke("chat-ai", {
        body: {
          messages: allMessages || [],
        },
      });

      if (aiError) throw aiError;

      // Save AI response
      const { error: aiMsgError } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        role: "assistant",
        content: aiResponse.message,
      });

      if (aiMsgError) throw aiMsgError;
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

  return { messages, isLoading, sendMessage };
};
