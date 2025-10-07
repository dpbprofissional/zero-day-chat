import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Terminal } from "lucide-react";

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: "Acesso autorizado",
          description: "Sistema neural conectado",
        });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: "Conta criada",
          description: "Neural link estabelecido com sucesso",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro de autenticação",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8 bg-card border-border border-glow">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded bg-primary/20 border border-primary border-glow flex items-center justify-center">
            <Terminal className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-glow glitch" data-text="HACK.AI">
              HACK.AI
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              Authentication Protocol v2.1.0
            </p>
          </div>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-mono">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="bg-input border-border focus:border-primary focus:border-glow font-mono"
              placeholder="user@neural.net"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground font-mono">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="bg-input border-border focus:border-primary focus:border-glow font-mono"
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow font-mono"
          >
            {loading ? "Processando..." : isLogin ? "Login" : "Criar conta"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-muted-foreground hover:text-primary transition-colors font-mono"
          >
            {isLogin ? "Criar nova conta" : "Já tenho acesso"}
          </button>
        </div>
      </Card>
    </div>
  );
};
