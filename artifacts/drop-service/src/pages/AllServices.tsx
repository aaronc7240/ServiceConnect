import { useState, useEffect } from "react"
import { Link } from "wouter"
import { Helmet } from "react-helmet-async"
import { motion } from "framer-motion"
import {
  Wrench, Droplets, Car, Home as HomeIcon, Zap, ArrowRight, Key, Leaf, Hammer, Paintbrush,
  Search, Sparkles, Trash2, Thermometer, Heart, Flame, Bug, Building2, Package, Shield,
  Settings, Sun, Accessibility, Star
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { useListServices } from "@workspace/api-client-react"

const CARD_GRADIENTS = [
  "from-blue-500 to-blue-700",
  "from-emerald-500 to-emerald-700",
  "from-amber-500 to-amber-600",
  "from-violet-500 to-violet-700",
  "from-green-500 to-green-700",
  "from-orange-500 to-orange-600",
  "from-rose-500 to-rose-700",
  "from-teal-500 to-teal-700",
  "from-pink-500 to-pink-600",
  "from-red-500 to-red-700",
  "from-sky-500 to-sky-600",
  "from-indigo-500 to-indigo-700",
  "from-cyan-500 to-cyan-700",
  "from-yellow-500 to-yellow-600",
  "from-slate-600 to-slate-800",
  "from-purple-500 to-purple-700",
  "from-gray-600 to-gray-800",
  "from-lime-500 to-lime-700",
  "from-blue-400 to-blue-600",
  "from-amber-600 to-amber-800",
];

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

export function AllServices() {
  const { data: services, isLoading } = useListServices();
  const [search, setSearch] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <>
      <Helmet>
        <title>All Local Services | ServiceConnect</title>
        <meta name="description" content="Browse all 20 local services available through ServiceConnect. Find trusted professionals for plumbing, cleaning, electrical, landscaping and more across Ireland." />
        <link rel="canonical" href="https://serviceconnect.ie/services" />
        <meta property="og:title" content="All Local Services | ServiceConnect" />
        <meta property="og:description" content="Browse all 20 local services available through ServiceConnect across Ireland." />
        <meta property="og:url" content="https://serviceconnect.ie/services" />
      </Helmet>
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-slate-900 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl font-display font-bold text-white mb-3">All Services</h1>
          <p className="text-slate-400 text-lg">Choose a service below to get a free, no-obligation quote from a trusted local professional.</p>
        </div>
      </div>

      {/* Search + grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
          const filtered = (services ?? []).filter(s =>
            s.active && s.name.toLowerCase().includes(search.toLowerCase())
          );
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
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: (index % 3) * 0.07 }}
                >
                  <Link href={`/request/${service.id}`}>
                    <div className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-slate-100">
                      <div className={`relative bg-gradient-to-br ${CARD_GRADIENTS[index % CARD_GRADIENTS.length]} h-36 flex items-center justify-center overflow-hidden flex-shrink-0`}>
                        <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/10 rounded-full" />
                        <div className="absolute -left-4 -bottom-4 w-20 h-20 bg-black/10 rounded-full" />
                        <div className="relative z-10 w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm ring-2 ring-white/30 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                          {getIcon(service.icon)}
                        </div>
                        <div className="absolute top-3 right-3 bg-black/20 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full tracking-wide">
                          Free Quote
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors leading-snug">
                          {service.name}
                        </h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-5 line-clamp-2 flex-1">
                          {service.description}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <span className="flex items-center text-primary font-semibold text-sm gap-1.5 group-hover:gap-2.5 transition-all">
                            Get Free Quote
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">Fast response</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
    </>
  );
}
