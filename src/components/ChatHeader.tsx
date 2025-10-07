import { Terminal } from "lucide-react";

export const ChatHeader = () => {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-primary/20 border border-primary border-glow flex items-center justify-center">
            <Terminal className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-glow glitch" data-text="HACK.AI">
              HACK.AI
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              Neural Interface v2.1.0 // <span className="text-primary">ONLINE</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
