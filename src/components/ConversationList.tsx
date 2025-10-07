import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  title: string;
  updated_at: string;
}

interface ConversationListProps {
  currentId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
}

export const ConversationList = ({ currentId, onSelect, onCreate }: ConversationListProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadConversations();
  }, []);

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
  };

  const deleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const { error } = await supabase
      .from("conversations")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Erro",
        description: "Falha ao deletar conversa",
        variant: "destructive",
      });
      return;
    }

    loadConversations();
    if (currentId === id) {
      onCreate();
    }
  };

  return (
    <div className="w-64 border-r border-border bg-card/50 backdrop-blur-sm flex flex-col">
      <div className="p-4 border-b border-border">
        <Button
          onClick={onCreate}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Conversa
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={cn(
              "group flex items-center gap-2 p-3 rounded cursor-pointer transition-all",
              currentId === conv.id
                ? "bg-primary/20 border border-primary/50"
                : "hover:bg-muted/50"
            )}
          >
            <MessageSquare className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="flex-1 text-sm truncate font-mono">
              {conv.title}
            </span>
            <button
              onClick={(e) => deleteConversation(conv.id, e)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
