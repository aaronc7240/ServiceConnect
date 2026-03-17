import { useState } from "react"
import { useLocation } from "wouter"
import { ShieldCheck, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function AdminLogin() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      localStorage.setItem("admin_token", "true");
      setLocation("/admin");
    } else {
      setError(true);
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full relative">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-[2rem] blur opacity-25"></div>
        
        <div className="relative bg-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-700">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
          </div>
          
          <h1 className="text-2xl font-display font-bold text-white text-center mb-2">Partner Portal</h1>
          <p className="text-slate-400 text-center mb-8">Enter your password to access the dashboard</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <Input 
                  type="password" 
                  placeholder="Enter password..." 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 bg-slate-900 border-slate-700 text-white focus-visible:ring-primary/20 h-14"
                  autoFocus
                />
              </div>
              {error && <p className="text-destructive text-sm mt-2 text-center">Incorrect password. Hint: admin123</p>}
            </div>
            
            <Button type="submit" size="lg" className="w-full h-14 text-lg">
              Login to Dashboard
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
