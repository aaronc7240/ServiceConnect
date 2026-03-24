import { useState } from "react"
import { Link } from "wouter"
import { Helmet } from "react-helmet-async"
import { motion } from "framer-motion"
import { ShieldCheck, Clock, Star, Wrench, Droplets, Car, Home as HomeIcon, Zap, ArrowRight, CheckCircle2, Key, Leaf, Hammer, Paintbrush, Search, Sparkles, Trash2, Thermometer, Heart, Flame, Bug, Building2, Package, Shield, Settings, Sun, Accessibility } from "lucide-react"
import { Button } from "@/components/ui/button"
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "ServiceConnect",
    "description": "Trusted local service professionals across Ireland. Get free quotes for plumbing, electrical, cleaning, landscaping and more.",
    "url": "https://serviceconnect.ie",
    "image": "https://serviceconnect.ie/opengraph.jpg",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IE"
    },
    "areaServed": "Ireland",
    "serviceType": [
      "Emergency Plumbing", "Deep Cleaning", "Handyman Services", "Electrician",
      "Landscaping", "Waste Removal", "Painting & Decorating", "Energy Retrofitting",
      "Pet Grooming", "Boiler Servicing", "Gutter Cleaning", "Pest Control",
      "Property Management", "Locksmith", "CCTV Installation", "Carpet Cleaning",
      "Tree Surgery", "Roofing", "Tiling", "Solar Panel Installation"
    ],
    "priceRange": "€€"
  };

  return (
    <>
      <Helmet>
        <title>ServiceConnect — Trusted Local Services in Ireland</title>
        <meta name="description" content="Get free quotes from trusted local professionals across Ireland. Plumbing, electrical, cleaning, landscaping and 17 more services. Fast, reliable, vetted tradespeople." />
        <link rel="canonical" href="https://serviceconnect.ie/" />
        <meta property="og:title" content="ServiceConnect — Trusted Local Services in Ireland" />
        <meta property="og:description" content="Get free quotes from trusted local professionals across Ireland. Plumbing, electrical, cleaning, landscaping and more." />
        <meta property="og:url" content="https://serviceconnect.ie/" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden bg-gradient-to-br from-slate-900 via-[#0c1f4a] to-slate-900">
        {/* Decorative glow orbs */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-blue-600/20 rounded-full blur-3xl -mr-64 -mt-48 pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[440px]">

            {/* Left: copy */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white font-semibold text-sm mb-6 border border-white/20 backdrop-blur-sm">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> Top Rated Local Professionals
              </div>
              <h1 className="text-5xl md:text-6xl font-display font-bold text-white leading-[1.1] mb-6">
                Find <span className="text-blue-400">Trusted</span> Local Pros in Minutes
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed">
                Skip the hassle of calling around. Tell us what you need, and we'll connect you with vetted, highly-rated service providers in your area.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <Button
                  size="lg"
                  className="text-lg px-10 h-14 w-full sm:w-auto bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/30"
                  onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Browse All Services
                </Button>
                <div className="flex items-center gap-5 text-sm font-medium text-slate-300 sm:h-14 sm:items-center">
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> No hidden fees</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> Vetted pros</span>
                </div>
              </div>
            </motion.div>

            {/* Right: quick service picker */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/15 p-6 shadow-2xl">
                <p className="text-white/60 font-semibold text-xs uppercase tracking-widest mb-4">Jump straight to a service</p>
                <div className="grid grid-cols-3 gap-3">
                  {(services ?? []).filter(s => s.active).slice(0, 6).map((s, i) => (
                    <Link href={`/request/${s.id}`} key={s.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + i * 0.06 }}
                        className="group flex flex-col items-center gap-2 bg-white/10 hover:bg-white/20 rounded-2xl p-3.5 text-center cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg"
                      >
                        <div className="w-11 h-11 rounded-xl bg-blue-500/30 flex items-center justify-center text-white group-hover:bg-blue-500/50 transition-colors">
                          <span className="scale-75 block">{getIcon(s.icon)}</span>
                        </div>
                        <span className="text-white text-[11px] font-medium leading-tight line-clamp-2">{s.name}</span>
                      </motion.div>
                    </Link>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-white/40 text-xs">20 services available</span>
                  <Link href="/services">
                    <span className="text-blue-300 hover:text-blue-200 text-xs font-semibold flex items-center gap-1 transition-colors">
                      View all <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Wave transition to white */}
        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 1440 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path d="M0 56V28C240 0 480 14 720 28C960 42 1200 14 1440 0V56H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="py-10 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "500+", label: "Quotes Requested" },
              { value: "20", label: "Service Categories" },
              { value: "26", label: "Counties Covered" },
              { value: "4.9★", label: "Average Rating" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-3xl font-display font-bold text-primary mb-1">{value}</div>
                <div className="text-sm text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-3">How It Works</h2>
            <p className="text-slate-600">Get connected with a trusted local professional in just a few steps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary/30 to-primary/30" />
            {[
              { step: "1", title: "Tell Us What You Need", desc: "Fill in a short form describing your job — takes less than 2 minutes. No account needed.", icon: "📋" },
              { step: "2", title: "We Match You Instantly", desc: "We review your request and match you with a vetted local professional in your area.", icon: "🔍" },
              { step: "3", title: "Receive Your Free Quote", desc: "The professional contacts you directly with a tailored, no-obligation quote.", icon: "✅" },
            ].map(({ step, title, desc, icon }) => (
              <div key={step} className="relative bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl mx-auto mb-5">{icon}</div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">{step}</div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-24 bg-white">
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
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: (index % 3) * 0.07 }}
                >
                  <Link href={`/request/${service.id}`}>
                    <div className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-slate-100">
                      {/* Colour-coded gradient header */}
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

                      {/* Card content */}
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
            )
          })()}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-3">What Our Customers Say</h2>
            <p className="text-slate-500">Trusted by hundreds of homeowners across Ireland</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Sinéad O'Brien", location: "Dublin 6", service: "Plumbing", text: "Burst pipe on a Sunday morning and ServiceConnect had a plumber at my door within the hour. Absolutely brilliant service — highly recommend.", stars: 5 },
              { name: "Declan Murphy", location: "Cork City", service: "Electrician", text: "Got three quotes for my EV charger install through ServiceConnect. The whole process was seamless and I saved over €300 versus ringing around myself.", stars: 5 },
              { name: "Aoife Kelly", location: "Galway", service: "Cleaning", text: "End-of-tenancy clean was spotless. Got my full deposit back. The cleaner was professional, thorough, and really good value. Will definitely use again.", stars: 5 },
              { name: "Pádraig Walsh", location: "Limerick", service: "Landscaping", text: "Garden was a disaster after the winter. ServiceConnect sent a brilliant team who transformed it in a day. Neighbours are jealous!", stars: 5 },
              { name: "Fiona Ryan", location: "Waterford", service: "Handyman", text: "Had a list of small jobs that were nagging at me for months. One handyman sorted everything in an afternoon. Great communication throughout.", stars: 5 },
              { name: "Seamus Brennan", location: "Kilkenny", service: "Boiler Service", text: "Boiler was playing up before winter. ServiceConnect matched me with an RGI engineer quickly. Fast, professional, and reasonably priced.", stars: 5 },
            ].map(({ name, location, service, text, stars }) => (
              <div key={name} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex text-amber-400 mb-3">{"★".repeat(stars)}</div>
                <p className="text-slate-700 text-sm leading-relaxed mb-5 italic">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm flex-shrink-0">
                    {name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{name}</div>
                    <div className="text-xs text-slate-400">{location} · {service}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-display font-bold text-slate-900 mb-3">Serving All 26 Counties</h2>
          <p className="text-slate-500 mb-12">Our network of trusted professionals covers the entire Republic of Ireland.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { province: "Leinster", counties: ["Dublin", "Wicklow", "Wexford", "Kildare", "Meath", "Louth", "Kilkenny", "Carlow", "Laois", "Offaly", "Westmeath", "Longford"] },
              { province: "Munster", counties: ["Cork", "Kerry", "Limerick", "Tipperary", "Waterford", "Clare"] },
              { province: "Connacht", counties: ["Galway", "Mayo", "Roscommon", "Leitrim", "Sligo"] },
              { province: "Ulster (ROI)", counties: ["Donegal", "Cavan", "Monaghan"] },
            ].map(({ province, counties }) => (
              <div key={province} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left">
                <h3 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wide">{province}</h3>
                <ul className="space-y-1">
                  {counties.map(c => (
                    <li key={c} className="text-sm text-slate-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/50 flex-shrink-0" />{c}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-3">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {[
              { q: "Is there a fee to submit a quote request?", a: "No. Submitting a quote request through ServiceConnect is completely free. We don't charge homeowners anything to connect them with professionals." },
              { q: "How quickly will I hear back?", a: "Most requests are matched within a few hours during business hours. For urgent or emergency jobs, we prioritise getting someone to you as quickly as possible." },
              { q: "Are the professionals vetted?", a: "Yes. Every professional in our network is verified before being listed. We check licences, insurance, and customer reviews to ensure you receive a quality, reliable service." },
              { q: "What if I'm not happy with the quote?", a: "You're under no obligation. If the quote doesn't work for you, simply let us know and we'll try to find an alternative professional, or you can walk away with no charge." },
              { q: "Which areas do you cover?", a: "We currently cover all 26 counties in the Republic of Ireland, with a strong network of professionals in all major cities and surrounding areas." },
              { q: "Can I upload photos of the job?", a: "Yes! When submitting your request, you can upload photos to help the professional understand the scope of work and provide a more accurate quote." },
            ].map(({ q, a }, i) => (
              <details key={i} className="group bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer select-none font-semibold text-slate-900 text-sm list-none">
                  {q}
                  <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-400 group-open:rotate-180 transition-transform duration-200">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </span>
                </summary>
                <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">{a}</div>
              </details>
            ))}
          </div>
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
    </>
  )
}
