import { Link, useLocation } from "wouter"
import { ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [location] = useLocation();
  const isAdmin = location.startsWith('/admin');

  if (isAdmin) return null;

  function handleGetQuote() {
    if (location === "/") {
      const el = document.getElementById("services");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.location.href = "/#services";
    }
  }

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-lg border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-900">
              Service<span className="text-primary">Connect</span>
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors hidden sm:block">
              Provider Login
            </Link>
            <Button onClick={handleGetQuote}>Get a Quote</Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
