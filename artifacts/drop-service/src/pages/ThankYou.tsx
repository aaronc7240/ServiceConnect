import { Link } from "wouter"
import { CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThankYou() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in duration-500">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        
        <h1 className="text-4xl font-display font-bold text-slate-900 mb-4 animate-in slide-in-from-bottom-4 duration-500 delay-100">
          Request Received!
        </h1>
        
        <p className="text-lg text-slate-600 mb-8 animate-in slide-in-from-bottom-4 duration-500 delay-200">
          Thank you for choosing ServiceConnect. We are reviewing your request and will connect you with a trusted local professional shortly. They will reach out to you directly with a quote.
        </p>

        <div className="animate-in slide-in-from-bottom-4 duration-500 delay-300">
          <Link href="/">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Return to Home <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
