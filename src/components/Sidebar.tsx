import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, MessageSquare, Trash2, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

interface SidebarProps {
  conversations: Conversation[];
  currentConversation: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
}

export const Sidebar = ({
  conversations,
  currentConversation,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
}: SidebarProps) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen">
      <div className="p-4 border-b border-border">
        <Button
          onClick={onNewConversation}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow font-mono"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova conversa
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={cn(
                "group flex items-center gap-2 p-3 rounded border cursor-pointer transition-all",
                currentConversation === conv.id
                  ? "bg-primary/20 border-primary border-glow"
                  : "bg-muted/20 border-muted hover:border-primary/50"
              )}
            >
              <MessageSquare className="w-4 h-4 text-primary flex-shrink-0" />
              <span
                onClick={() => onSelectConversation(conv.id)}
                className="flex-1 text-sm truncate font-mono"
              >
                {conv.title}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConversation(conv.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4 text-destructive hover:text-destructive/80" />
              </button>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <Button
          onClick={handleLogout}
          variant="secondary"
          className="w-full font-mono"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Desconectar
        </Button>
      </div>
    </aside>
  );
};
