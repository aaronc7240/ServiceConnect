import { useState, useEffect } from "react";
import { X, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

const COOKIE_KEY = "sc_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) setVisible(true);
  }, []);

  const accept = () => { localStorage.setItem(COOKIE_KEY, "accepted"); setVisible(false); };
  const decline = () => { localStorage.setItem(COOKIE_KEY, "declined"); setVisible(false); };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Cookie className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-300 leading-relaxed">
            We use cookies to improve your experience and analyse site traffic. By clicking "Accept", you agree to our use of cookies.{" "}
            <a href="#" className="text-primary underline hover:text-primary/80 transition-colors">Learn more</a>
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={decline}
            className="text-sm text-slate-400 hover:text-white transition-colors underline"
          >
            Decline
          </button>
          <Button size="sm" onClick={accept} className="rounded-lg px-5">
            Accept
          </Button>
          <button onClick={decline} className="text-slate-500 hover:text-white transition-colors ml-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
