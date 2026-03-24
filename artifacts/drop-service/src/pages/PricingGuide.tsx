import { useParams } from "wouter"
import { Helmet } from "react-helmet-async"
import { CheckCircle2, ArrowRight, Clock, Euro } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "wouter"

interface PricingTier { label: string; price: string; desc: string }

interface ServicePricing {
  name: string;
  serviceId: number;
  intro: string;
  tiers: PricingTier[];
  factors: string[];
  tips: string[];
}

const pricingData: Record<string, ServicePricing> = {
  "plumbing": {
    name: "Emergency Plumbing / RGI Gas",
    serviceId: 1,
    intro: "Plumbing costs in Ireland depend on the urgency, complexity, and parts needed. Emergency call-outs attract premium rates, especially out of hours.",
    tiers: [
      { label: "Call-out Fee", price: "€60 – €120", desc: "Standard call-out, Mon–Fri daytime" },
      { label: "Minor Repair", price: "€120 – €250", desc: "Tap washer, toilet flush mechanism, leaking pipe joint" },
      { label: "Major Repair", price: "€250 – €600", desc: "Burst pipe, boiler pressure fault, water tank replacement" },
      { label: "Emergency Out-of-Hours", price: "€200 – €500+", desc: "Weekend or late-night emergency call-outs" },
    ],
    factors: ["Time of day and urgency", "Parts required", "Location (rural vs urban)", "Complexity of the job", "VAT (13.5% on labour)"],
    tips: ["Turn off the stopcock to limit damage while waiting", "Take photos of the issue before the plumber arrives", "Ask for a written quote before work begins"],
  },
  "cleaning": {
    name: "Deep / End-of-Tenancy Cleaning",
    serviceId: 2,
    intro: "Cleaning costs vary by property size and level of dirt. End-of-tenancy cleans are more thorough than regular cleans and typically take 4–8 hours.",
    tiers: [
      { label: "1-Bed Apartment", price: "€150 – €250", desc: "Full end-of-tenancy clean including kitchen and bathroom" },
      { label: "2-Bed House", price: "€200 – €350", desc: "All rooms, oven clean, and internal windows" },
      { label: "3-Bed House", price: "€280 – €450", desc: "Full deep clean with carpets and inside all appliances" },
      { label: "4+ Bed House", price: "€400 – €700+", desc: "Large property full clean, price on inspection" },
    ],
    factors: ["Number of bedrooms and bathrooms", "Condition of the property", "Whether carpets are included", "Oven and appliance cleaning", "Speed required"],
    tips: ["Book as soon as you know the move-out date", "Remove all belongings before cleaners arrive", "Take photos after the clean for your records"],
  },
  "handyman": {
    name: "General Handyman Services",
    serviceId: 3,
    intro: "Handyman rates in Ireland are typically charged by the hour or half-day. Most handymen can tackle a wide range of small jobs efficiently.",
    tiers: [
      { label: "Hourly Rate", price: "€40 – €65/hr", desc: "Most handymen charge by the hour" },
      { label: "Half Day (4hrs)", price: "€140 – €200", desc: "Multiple small tasks — hanging doors, shelves, etc." },
      { label: "Full Day (8hrs)", price: "€250 – €400", desc: "Larger scope of work, multiple rooms" },
      { label: "Weekend Rate", price: "+20–30%", desc: "Premium applies for weekend availability" },
    ],
    factors: ["Number of tasks", "Specialist tools required", "Materials cost (separate)", "Accessibility of the work area", "Location"],
    tips: ["Bundle multiple jobs together to maximise value", "Provide a clear list of tasks before they arrive", "Buy materials in advance if possible to save time"],
  },
  "electrician": {
    name: "Electricians (Solar / EV Charger)",
    serviceId: 4,
    intro: "Electrical work in Ireland must be carried out by a RECI or ECSSA registered electrician. EV charger and solar panel installation costs vary significantly by system size.",
    tiers: [
      { label: "Standard Call-out", price: "€80 – €150", desc: "Fault finding, socket repair, light fitting" },
      { label: "EV Charger Install", price: "€500 – €1,200", desc: "Including SEAI grant-eligible 7kW home charger" },
      { label: "Solar PV System (4kW)", price: "€6,000 – €10,000", desc: "Supply and install, eligible for SEAI grants" },
      { label: "Full Rewire (3-Bed)", price: "€4,000 – €8,000", desc: "Complete electrical rewire with RECI cert" },
    ],
    factors: ["SEAI grant eligibility (up to €2,400 for EV, up to €2,100 for solar)", "System size and brand", "Existing wiring condition", "Number of consumer units", "RECI certification required"],
    tips: ["Check SEAI.ie for current grant amounts before getting quotes", "Always ask for an RECI cert on completion", "Get 3 quotes for larger solar/EV jobs"],
  },
  "landscaping": {
    name: "Landscaping & Garden Maintenance",
    serviceId: 5,
    intro: "Garden maintenance costs range from a one-off tidy to full landscaping projects. Ongoing maintenance is often charged per visit or on a monthly contract.",
    tiers: [
      { label: "Garden Tidy (once-off)", price: "€150 – €400", desc: "Mowing, hedging, weeding, waste removal" },
      { label: "Monthly Maintenance", price: "€80 – €200/month", desc: "Regular upkeep for average-sized gardens" },
      { label: "Paving / Decking", price: "€50 – €150/m²", desc: "Supply and lay, depending on materials" },
      { label: "Full Landscape Design", price: "€5,000 – €30,000+", desc: "Full garden redesign with planting, paving, and features" },
    ],
    factors: ["Garden size and condition", "Waste removal included?", "Materials for hard landscaping", "Frequency of visits", "Seasonal demand"],
    tips: ["Get quotes in winter/early spring for better rates", "Ask for before/after photos of previous work", "Check if waste disposal is included in the quote"],
  },
};

const DEFAULT_PRICING: ServicePricing = {
  name: "Local Service",
  serviceId: 1,
  intro: "Prices vary depending on the scope of work, location, and specific requirements. Get a free, no-obligation quote from a trusted local professional.",
  tiers: [
    { label: "Small Job", price: "€50 – €200", desc: "Minor works, quick fix, or consultation" },
    { label: "Medium Job", price: "€200 – €800", desc: "Standard project taking a few hours" },
    { label: "Large Job", price: "€800 – €3,000+", desc: "Complex work or multi-day project" },
    { label: "Ongoing Contract", price: "POA", desc: "Regular maintenance or service contract" },
  ],
  factors: ["Scope and complexity", "Materials required", "Location", "Urgency", "Seasonal demand"],
  tips: ["Get at least 2–3 quotes", "Ask for a written quote before work begins", "Check public liability insurance"],
};

export function PricingGuide() {
  const { slug } = useParams<{ slug: string }>();
  const pricing = (slug && pricingData[slug]) ? pricingData[slug] : DEFAULT_PRICING;

  return (
    <>
      <Helmet>
        <title>{pricing.name} Pricing Ireland 2025 | ServiceConnect</title>
        <meta name="description" content={`How much does ${pricing.name.toLowerCase()} cost in Ireland? View typical price ranges, cost factors, and money-saving tips for ${new Date().getFullYear()}.`} />
      </Helmet>
      <div className="bg-slate-50 min-h-screen py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
              <Euro className="w-3.5 h-3.5" /> Pricing Guide · Ireland
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
              How Much Does {pricing.name} Cost in Ireland?
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">{pricing.intro}</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
            <div className="bg-slate-900 px-6 py-4">
              <h2 className="text-white font-bold text-lg">Typical Price Ranges ({new Date().getFullYear()})</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {pricing.tiers.map((tier, i) => (
                <div key={i} className="flex items-start justify-between gap-4 px-6 py-5">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 mb-0.5">{tier.label}</p>
                    <p className="text-sm text-slate-500">{tier.desc}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-bold text-primary text-lg">{tier.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> What Affects the Price?
              </h2>
              <ul className="space-y-2">
                {pricing.factors.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-primary font-bold mt-0.5">·</span> {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" /> Money-Saving Tips
              </h2>
              <ul className="space-y-2">
                {pricing.tips.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-primary rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-display font-bold mb-3">Get a Free, Accurate Quote</h2>
            <p className="text-primary-foreground/80 mb-6">These are guide prices only. Get a real quote tailored to your specific job from a trusted local professional.</p>
            <Link href="/#services">
              <Button variant="secondary" size="lg" className="font-semibold">
                Browse Services <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
