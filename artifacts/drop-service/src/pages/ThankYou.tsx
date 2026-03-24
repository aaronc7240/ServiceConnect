import { Link, useSearch } from "wouter"
import { Helmet } from "react-helmet-async"
import { CheckCircle2, ArrowRight, Search, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function ThankYou() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const ref = params.get("ref");
  const [copied, setCopied] = useState(false);

  const copyRef = () => {
    if (ref) { navigator.clipboard.writeText(ref).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); }
  };

  return (
    <>
      <Helmet>
        <title>Request Received | ServiceConnect</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in duration-500">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        
        <h1 className="text-4xl font-display font-bold text-slate-900 mb-4 animate-in slide-in-from-bottom-4 duration-500 delay-100">
          Request Received!
        </h1>
        
        <p className="text-lg text-slate-600 mb-6 animate-in slide-in-from-bottom-4 duration-500 delay-200">
          Thank you for choosing ServiceConnect. We are reviewing your request and will connect you with a trusted local professional shortly.
        </p>

        {ref && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 delay-250 mb-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <p className="text-sm text-slate-500 mb-2">Your reference code</p>
              <div className="flex items-center justify-center gap-3">
                <span className="font-mono text-2xl font-bold text-slate-900 tracking-widest">{ref}</span>
                <button onClick={copyRef} className="text-slate-400 hover:text-slate-700 transition-colors">
                  {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-2">Save this code to track your request</p>
            </div>
          </div>
        )}

        <div className="animate-in slide-in-from-bottom-4 duration-500 delay-300 flex flex-col sm:flex-row gap-3 justify-center">
          {ref && (
            <Link href={`/quote-status?ref=${ref}`}>
              <Button variant="outline" size="lg">
                <Search className="w-4 h-4 mr-2" /> Track Request
              </Button>
            </Link>
          )}
          <Link href="/">
            <Button variant={ref ? "ghost" : "outline"} size="lg">
              Return to Home <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
    </>
  )
}
