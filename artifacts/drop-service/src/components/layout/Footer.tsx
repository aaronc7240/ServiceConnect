import { Link, useLocation } from "wouter"
import { ShieldCheck, Heart, Star } from "lucide-react"

export function Footer() {
  const [location] = useLocation();
  if (location.startsWith('/admin')) return null;

  return (
    <footer className="bg-slate-900 text-slate-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/20 text-primary">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-white">
                Service<span className="text-primary">Connect</span>
              </span>
            </div>
            <p className="text-slate-400 mb-6 max-w-sm">
              Connecting you with the most trusted, vetted, and reliable local service professionals in your area.
            </p>
            <div className="flex gap-4 text-sm font-medium text-slate-400">
              <div className="flex items-center gap-1"><Heart className="w-4 h-4 text-accent" /> Trusted</div>
              <div className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400" /> Rated</div>
              <div className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-green-400" /> Vetted</div>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6">Services</h4>
            <ul className="space-y-3">
              <li><Link href="/request/1" className="hover:text-primary transition-colors">Locksmith</Link></li>
              <li><Link href="/request/2" className="hover:text-primary transition-colors">Power Washing</Link></li>
              <li><Link href="/request/3" className="hover:text-primary transition-colors">Car Cleaning</Link></li>
              <li><Link href="/#services" className="hover:text-primary transition-colors">View All Services</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              <li><Link href="/admin" className="hover:text-primary transition-colors">Partner Portal</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-slate-800 text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} ServiceConnect. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Designed for Local Businesses.</p>
        </div>
      </div>
    </footer>
  )
}
