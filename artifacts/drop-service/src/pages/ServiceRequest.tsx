import { useState, useEffect } from "react"
import { useLocation, useParams } from "wouter"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ShieldCheck, ArrowLeft, Loader2, CheckCircle } from "lucide-react"
import { useListServices, useSubmitLead } from "@workspace/api-client-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const TIMEFRAME_OPTIONS = ["ASAP", "Within 1 week", "Within 2 weeks", "Within a month", "Flexible / No rush"];
const BUDGET_STEPS = ["Under €500", "€500 – €1,000", "€1,000 – €2,500", "€2,500 – €5,000", "€5,000+"];

const formSchema = z.object({
  serviceId: z.coerce.number().min(1, "Please select a service"),
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Please enter a valid email"),
  customerPhone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter your address or zip code"),
  description: z.string().min(10, "Please provide a brief description of what you need"),
  timeframe: z.string().optional(),
  budgetRange: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const descriptionPlaceholders: Record<string, string> = {
  'emergency plumbing / rgi gas': "E.g., Burst pipe under the kitchen sink, water is leaking badly and needs urgent repair...",
  'deep / end-of-tenancy cleaning': "E.g., Moving out of a 3-bed house, need a full end-of-tenancy clean including oven and carpets...",
  'general handyman services': "E.g., A few small jobs — fixing a door that won't close, patching a hole in the wall, and re-hanging a shelf...",
  'electricians (solar/ev charger)': "E.g., Looking to install a home EV charger in my garage and need a certified electrician to fit it...",
  'landscaping & garden maintenance': "E.g., Garden is overgrown, need the lawn cut, hedges trimmed, and some weeding done...",
  'waste removal & house clearance': "E.g., Clearing out a 2-bed house — old furniture, white goods, and general rubbish to be removed...",
  'painting & decorating (interior)': "E.g., Need the living room and hallway painted, walls are currently magnolia and I'd like a fresh white finish...",
  'energy retrofitting / insulation': "E.g., Looking to improve the insulation in my attic and walls — the house is losing a lot of heat...",
  'mobile pet grooming': "E.g., Golden Retriever who needs a full groom — bath, trim, nail clipping, and brush out...",
  'boiler servicing & repair': "E.g., Boiler hasn't been serviced in 2 years and is making a knocking noise — needs inspection and service...",
  'gutter cleaning & power washing': "E.g., Gutters are blocked and overflowing, also want the driveway pressure washed while the team is here...",
  'pest control': "E.g., Found signs of mice in the kitchen — droppings and chewed packets. Need an inspection and treatment...",
  'property management (airbnb)': "E.g., Have a 2-bed apartment I want to list on Airbnb, looking for someone to handle check-ins, cleaning, and guest comms...",
  'flat pack furniture assembly': "E.g., Just bought a large IKEA wardrobe and a chest of drawers, need someone to assemble both...",
  'home security & cctv install': "E.g., Looking to install 4 outdoor cameras and a video doorbell — house had a break-in attempt last month...",
  'carpet & upholstery cleaning': "E.g., 3-bed house carpets need a deep clean, plus the sofa is heavily stained and needs refreshing...",
  'locksmith services': "E.g., Locked out of my front door, the key broke inside the lock and I need help getting in...",
  'appliance repair (washers/ovens)': "E.g., Washing machine stopped mid-cycle and won't drain — need someone to diagnose and fix it...",
  'window cleaning (residential)': "E.g., 3-storey house, all exterior windows need cleaning — last done about 6 months ago...",
  'senior home modifications': "E.g., Need grab rails fitted in the bathroom and a ramp at the front door for my father who uses a walker...",
};

const getPlaceholder = (serviceName?: string) => {
  if (!serviceName) return "E.g., Describe what you need done, any specific requirements, and when you'd like it completed...";
  return descriptionPlaceholders[serviceName.toLowerCase()] 
    ?? `E.g., Describe what you need for ${serviceName}, including any specific details or requirements...`;
};

export function ServiceRequest() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { data: services, isLoading: servicesLoading } = useListServices();
  const submitLead = useSubmitLead();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);
  
  const selectedService = services?.find(s => s.id === Number(id));

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceId: id ? Number(id) : undefined,
      budgetRange: BUDGET_STEPS[1],
    }
  });

  const [budgetIndex, setBudgetIndex] = useState(1);

  const watchedServiceId = watch("serviceId");
  const watchedService = services?.find(s => s.id === Number(watchedServiceId));
  const descriptionPlaceholder = getPlaceholder(watchedService?.name);

  const onSubmit = (data: FormValues) => {
    submitLead.mutate({ data }, {
      onSuccess: () => {
        setLocation('/thank-you');
      }
    });
  };

  if (servicesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 -skew-y-2 transform origin-top-left -z-10" />

      <div className="max-w-3xl mx-auto relative z-10">
        <button 
          onClick={() => setLocation('/')}
          className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to services
        </button>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden">
          <div className="bg-slate-900 p-8 sm:p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-20 -mt-20" />
            <h1 className="text-3xl font-display font-bold mb-2 relative z-10">
              Request a Quote {selectedService ? `for ${selectedService.name}` : ''}
            </h1>
            <p className="text-slate-300 text-lg relative z-10">
              Fill out the form below and we'll connect you with a top-rated local pro immediately.
            </p>
          </div>

          <div className="p-8 sm:p-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">What service do you need?</label>
                <select 
                  {...register("serviceId")}
                  className="flex h-12 w-full rounded-xl border-2 border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 transition-all"
                >
                  <option value="">Select a service...</option>
                  {services?.filter(s => s.active).map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                {errors.serviceId && <p className="text-destructive text-sm mt-1.5">{errors.serviceId.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Full Name</label>
                  <Input placeholder="John Doe" {...register("customerName")} />
                  {errors.customerName && <p className="text-destructive text-sm mt-1.5">{errors.customerName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Phone Number</label>
                  <Input placeholder="(555) 123-4567" type="tel" {...register("customerPhone")} />
                  {errors.customerPhone && <p className="text-destructive text-sm mt-1.5">{errors.customerPhone.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Email Address</label>
                  <Input placeholder="john@example.com" type="email" {...register("customerEmail")} />
                  {errors.customerEmail && <p className="text-destructive text-sm mt-1.5">{errors.customerEmail.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Service Address / Zip Code</label>
                  <Input placeholder="123 Main St or 90210" {...register("address")} />
                  {errors.address && <p className="text-destructive text-sm mt-1.5">{errors.address.message}</p>}
                </div>
              </div>

              {/* Timeframe + Budget row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">When do you need this done?</label>
                  <select
                    {...register("timeframe")}
                    className="flex h-12 w-full rounded-xl border-2 border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 transition-all"
                  >
                    <option value="">Select a timeframe...</option>
                    {TIMEFRAME_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-3">Approximate budget</label>
                  <div className="px-1">
                    <input
                      type="range"
                      min={0}
                      max={BUDGET_STEPS.length - 1}
                      step={1}
                      value={budgetIndex}
                      onChange={e => {
                        const i = Number(e.target.value);
                        setBudgetIndex(i);
                        setValue("budgetRange", BUDGET_STEPS[i]);
                      }}
                      style={{
                        background: `linear-gradient(to right, hsl(221 83% 53%) ${(budgetIndex / (BUDGET_STEPS.length - 1)) * 100}%, #e2e8f0 ${(budgetIndex / (BUDGET_STEPS.length - 1)) * 100}%)`
                      }}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md"
                    />
                    <div className="flex justify-between mt-2">
                      {BUDGET_STEPS.map((label, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => { setBudgetIndex(i); setValue("budgetRange", BUDGET_STEPS[i]); }}
                          className={`text-[10px] leading-tight text-center transition-colors max-w-[56px] ${i === budgetIndex ? 'text-primary font-semibold' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Describe what you need</label>
                <Textarea 
                  placeholder={descriptionPlaceholder}
                  {...register("description")} 
                />
                {errors.description && <p className="text-destructive text-sm mt-1.5">{errors.description.message}</p>}
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 mt-8">
                <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900">
                  Your information is secure. We only share these details with the specific professional assigned to your job to provide an accurate quote.
                </p>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-14 text-lg" 
                disabled={submitLead.isPending}
              >
                {submitLead.isPending ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting Request...</>
                ) : (
                  <><CheckCircle className="w-5 h-5 mr-2" /> Request Quote Now</>
                )}
              </Button>

              {submitLead.isError && (
                <p className="text-destructive text-center text-sm">Failed to submit request. Please try again.</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
