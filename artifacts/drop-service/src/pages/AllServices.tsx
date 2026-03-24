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
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
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
          );
        })()}
      </div>
    </div>
    </>
  );
}
