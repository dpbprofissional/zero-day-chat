import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
          title: "Login realizado",
          description: "Bem-vindo de volta ao sistema!",
        });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: "Conta criada",
          description: "Acesso concedido ao sistema neural.",
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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border border-glow rounded-lg p-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded bg-primary/20 border border-primary border-glow flex items-center justify-center">
              <Terminal className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-glow glitch" data-text="HACK.AI">
              HACK.AI
            </h1>
          </div>
          
          <div className="mb-6">
            <div className="flex gap-2 p-1 bg-muted rounded-lg">
              <Button
                type="button"
                variant={isLogin ? "default" : "ghost"}
                className="flex-1"
                onClick={() => setIsLogin(true)}
              >
                Login
              </Button>
              <Button
                type="button"
                variant={!isLogin ? "default" : "ghost"}
                className="flex-1"
                onClick={() => setIsLogin(false)}
              >
                Cadastro
              </Button>
            </div>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm mb-2 text-muted-foreground">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@hack.ai"
                required
                className="bg-input border-border focus:border-primary focus:border-glow font-mono"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm mb-2 text-muted-foreground">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-input border-border focus:border-primary focus:border-glow font-mono"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
              disabled={loading}
            >
              {loading ? "Conectando..." : isLogin ? "Acessar Sistema" : "Criar Conta"}
            </Button>
          </form>

          <p className="text-xs text-center mt-6 text-muted-foreground font-mono">
            {isLogin ? "Não tem acesso?" : "Já tem acesso?"}{" "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
            >
              {isLogin ? "Solicitar acesso" : "Fazer login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
