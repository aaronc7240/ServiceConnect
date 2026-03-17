import { useState } from "react"
import { useLocation, useParams } from "wouter"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ShieldCheck, ArrowLeft, Loader2, CheckCircle } from "lucide-react"
import { useListServices, useSubmitLead } from "@workspace/api-client-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  serviceId: z.coerce.number().min(1, "Please select a service"),
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Please enter a valid email"),
  customerPhone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter your address or zip code"),
  description: z.string().min(10, "Please provide a brief description of what you need"),
});

type FormValues = z.infer<typeof formSchema>;

export function ServiceRequest() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { data: services, isLoading: servicesLoading } = useListServices();
  const submitLead = useSubmitLead();
  
  const selectedService = services?.find(s => s.id === Number(id));

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceId: id ? Number(id) : undefined,
    }
  });

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

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Describe what you need</label>
                <Textarea 
                  placeholder="E.g., I'm locked out of my car, need immediate assistance..." 
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
