import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { Search, Loader2, CheckCircle2, Clock, ArrowRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "wouter"

const STATUS_INFO: Record<string, { label: string; color: string; icon: React.ReactNode; message: string }> = {
  new: {
    label: "Received",
    color: "text-blue-600 bg-blue-50 border-blue-200",
    icon: <Clock className="w-5 h-5 text-blue-600" />,
    message: "Your request has been received and is being reviewed. We'll match you with a local professional shortly.",
  },
  contacted: {
    label: "In Progress",
    color: "text-amber-600 bg-amber-50 border-amber-200",
    icon: <Clock className="w-5 h-5 text-amber-600" />,
    message: "Great news — we're actively working on your request and are in contact with local professionals.",
  },
  forwarded: {
    label: "Matched",
    color: "text-purple-600 bg-purple-50 border-purple-200",
    icon: <CheckCircle2 className="w-5 h-5 text-purple-600" />,
    message: "Your request has been forwarded to a trusted local professional. They will contact you directly with a quote.",
  },
  completed: {
    label: "Completed",
    color: "text-green-600 bg-green-50 border-green-200",
    icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
    message: "Your job has been completed. Thank you for using ServiceConnect!",
  },
  cancelled: {
    label: "Cancelled",
    color: "text-slate-600 bg-slate-50 border-slate-200",
    icon: <AlertCircle className="w-5 h-5 text-slate-600" />,
    message: "This request has been cancelled. Please submit a new request if you still need assistance.",
  },
};

interface LeadStatus {
  referenceCode: string;
  serviceName: string;
  status: string;
  createdAt: string;
}

export function QuoteStatus() {
  const [ref, setRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LeadStatus | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ref.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`/api/leads/status?ref=${encodeURIComponent(ref.trim().toUpperCase())}`);
      if (res.status === 404) { setError("No request found with that reference code. Please check and try again."); return; }
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const statusInfo = result ? STATUS_INFO[result.status] ?? STATUS_INFO.new : null;

  return (
    <>
      <Helmet>
        <title>Track Your Quote Request | ServiceConnect</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="min-h-[80vh] bg-slate-50 py-16 px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Track Your Request</h1>
            <p className="text-slate-500">Enter the reference code from your confirmation email to check the status of your quote request.</p>
          </div>

          <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
            <label className="block text-sm font-semibold text-slate-900 mb-2">Reference Code</label>
            <div className="flex gap-3">
              <Input
                placeholder="e.g. SC3F7A"
                value={ref}
                onChange={e => setRef(e.target.value.toUpperCase())}
                className="font-mono text-lg tracking-widest uppercase"
                maxLength={8}
              />
              <Button type="submit" disabled={loading || !ref.trim()} className="flex-shrink-0">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
              </Button>
            </div>
          </form>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {result && statusInfo && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">Reference</p>
                  <p className="font-mono font-bold text-slate-900 text-lg">{result.referenceCode}</p>
                </div>
                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-semibold ${statusInfo.color}`}>
                  {statusInfo.icon}
                  {statusInfo.label}
                </span>
              </div>
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">Service Requested</p>
                  <p className="font-semibold text-slate-900">{result.serviceName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">Submitted</p>
                  <p className="text-slate-700">{new Date(result.createdAt).toLocaleDateString("en-IE", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
              </div>
              <div className={`rounded-xl border p-4 ${statusInfo.color}`}>
                <p className="text-sm leading-relaxed">{statusInfo.message}</p>
              </div>
            </div>
          )}

          <p className="text-center text-sm text-slate-400 mt-6">
            Need help?{" "}
            <Link href="/" className="text-primary hover:underline">
              Return to home <ArrowRight className="inline w-3 h-3" />
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
