import { useState } from "react"
import { Link } from "wouter"
import { motion } from "framer-motion"
import { ShieldCheck, Clock, Star, Wrench, Droplets, Car, Home as HomeIcon, Zap, ArrowRight, CheckCircle2, Key, Leaf, Hammer, Paintbrush, Search, Sparkles, Trash2, Thermometer, Heart, Flame, Bug, Building2, Package, Shield, Settings, Sun, Accessibility } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useListServices } from "@workspace/api-client-react"

// Map icon string from DB to lucide components
const getIcon = (icon: string) => {
  const icons: Record<string, React.ReactNode> = {
    'wrench': <Wrench className="w-8 h-8" />,
    'sparkles': <Sparkles className="w-8 h-8" />,
    'hammer': <Hammer className="w-8 h-8" />,
    'zap': <Zap className="w-8 h-8" />,
    'leaf': <Leaf className="w-8 h-8" />,
    'trash2': <Trash2 className="w-8 h-8" />,
    'paintbrush': <Paintbrush className="w-8 h-8" />,
    'thermometer': <Thermometer className="w-8 h-8" />,
    'heart': <Heart className="w-8 h-8" />,
    'flame': <Flame className="w-8 h-8" />,
    'droplets': <Droplets className="w-8 h-8" />,
    'bug': <Bug className="w-8 h-8" />,
    'building2': <Building2 className="w-8 h-8" />,
    'package': <Package className="w-8 h-8" />,
    'shield': <Shield className="w-8 h-8" />,
    'star': <Star className="w-8 h-8" />,
    'key': <Key className="w-8 h-8" />,
    'settings': <Settings className="w-8 h-8" />,
    'sun': <Sun className="w-8 h-8" />,
    'accessibility': <Accessibility className="w-8 h-8" />,
    'car': <Car className="w-8 h-8" />,
    'home': <HomeIcon className="w-8 h-8" />,
  };
  return icons[icon?.toLowerCase()] ?? <Wrench className="w-8 h-8" />;
};

export function Home() {
  const { data: services, isLoading } = useListServices();
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Abstract architectural background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6 border border-primary/20">
                <Star className="w-4 h-4 fill-primary" /> Top Rated Local Professionals
              </div>
              <h1 className="text-5xl md:text-6xl font-display font-bold text-slate-900 leading-[1.1] mb-6">
                Find <span className="text-gradient">Trusted</span> Local Pros in Minutes
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
                Skip the hassle of calling around. Tell us what you need, and we'll connect you with vetted, highly-rated service providers in your area.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-10 h-14 w-full sm:w-auto" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth'})}>
                  Browse Services
                </Button>
                <div className="flex items-center gap-3 text-sm font-medium text-slate-600 px-4">
                  <CheckCircle2 className="w-5 h-5 text-green-500" /> No hidden fees
                  <CheckCircle2 className="w-5 h-5 text-green-500 ml-2" /> Vetted pros
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">What do you need help with?</h2>
            <p className="text-slate-600 text-lg">Select a service below to get a free, no-obligation quote from a trusted local professional.</p>
          </div>

          {/* Search bar */}
          <div className="max-w-md mx-auto mb-10 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <Input
              type="search"
              placeholder="Search services..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 h-12 rounded-xl border-slate-200 shadow-sm focus:border-primary"
            />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-48 rounded-2xl bg-white animate-pulse shadow-sm" />
              ))}
            </div>
          ) : (() => {
            const filtered = services?.filter(s =>
              s.active && s.name.toLowerCase().includes(search.toLowerCase())
            ) ?? [];
            return filtered.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-lg font-medium">No services found for "{search}"</p>
                <p className="text-sm mt-1">Try a different search term.</p>
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25 }}
                >
                  <Link href={`/request/${service.id}`}>
                    <div className="group block h-full bg-white rounded-2xl p-8 border border-slate-200/60 shadow-lg shadow-slate-200/30 hover:shadow-xl hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />

                      <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300 relative z-10">
                        {getIcon(service.icon)}
                      </div>
                      
                      <h3 className="text-xl font-bold text-slate-900 mb-3 relative z-10 group-hover:text-primary transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-slate-600 mb-6 relative z-10 line-clamp-2">
                        {service.description}
                      </p>
                      
                      <div className="flex items-center text-primary font-semibold text-sm relative z-10">
                        Get Quotes <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            )
          })()}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-6">Why choose ServiceConnect?</h2>
              <p className="text-lg text-slate-600 mb-8">We take the guesswork out of hiring local professionals. Every partner in our network is thoroughly vetted to ensure you get the best service possible.</p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">Vetted Professionals</h4>
                    <p className="text-slate-600">We verify licenses, insurance, and past customer reviews.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">Fast Response Times</h4>
                    <p className="text-slate-600">Get connected with available pros in your area within minutes.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <Star className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">Quality Guaranteed</h4>
                    <p className="text-slate-600">We only work with providers who maintain high customer ratings.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              {/* Trust Badge visual */}
              <div className="aspect-square rounded-full bg-gradient-to-tr from-primary/10 to-accent/10 absolute -inset-4 z-0 blur-3xl opacity-50" />
              <div className="relative z-10 bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <ShieldCheck className="w-48 h-48" />
                </div>
                <ShieldCheck className="w-16 h-16 text-primary mb-6" />
                <h3 className="text-2xl font-display font-bold mb-4">The ServiceConnect Promise</h3>
                <p className="text-slate-300 leading-relaxed mb-8">
                  "If you're not completely satisfied with the professional we connect you with, we'll step in to make it right. Your peace of mind is our top priority."
                </p>
                <div className="flex items-center gap-4">
                  <img 
                    src={`${import.meta.env.BASE_URL}images/logo-mark.png`} 
                    alt="Logo" 
                    className="w-12 h-12 bg-white rounded-full p-2"
                  />
                  <div>
                    <div className="font-bold">Trust & Safety Team</div>
                    <div className="text-sm text-slate-400">ServiceConnect</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
