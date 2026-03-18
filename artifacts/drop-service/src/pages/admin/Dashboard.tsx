import { useState, useEffect } from "react"
import { useLocation } from "wouter"
import { format } from "date-fns"
import { 
  LayoutDashboard, Users, Briefcase, LogOut, 
  Search, Filter, Plus, MoreVertical, ShieldCheck, Mail, Phone, MapPin, 
  CheckCircle, Clock, XCircle, Forward, Loader2, Wrench, Star
} from "lucide-react"
import { 
  useListLeads, useUpdateLead, useDeleteLead, 
  useListServices, useCreateService, useDeleteService,
  useListProviders, useCreateProvider, useDeleteProvider
} from "@workspace/api-client-react"
import type { Lead, UpdateLeadStatus } from "@workspace/api-client-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

// --- Components ---

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, any> = {
    new: { color: "default", icon: Clock, label: "New Request" },
    contacted: { color: "warning", icon: Mail, label: "Contacted" },
    forwarded: { color: "info", icon: Forward, label: "Forwarded" },
    completed: { color: "success", icon: CheckCircle, label: "Completed" },
    cancelled: { color: "destructive", icon: XCircle, label: "Cancelled" },
  };
  
  const config = map[status] || map.new;
  const Icon = config.icon;
  
  return (
    <Badge variant={config.color} className="gap-1.5 py-1 px-3">
      <Icon className="w-3.5 h-3.5" />
      <span className="capitalize">{config.label}</span>
    </Badge>
  );
}

// --- Main Dashboard Component ---

export function AdminDashboard() {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'leads' | 'providers' | 'services'>('leads');
  
  // Auth check
  useEffect(() => {
    if (localStorage.getItem("admin_token") !== "true") {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setLocation("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full inset-y-0 z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-display font-bold text-xl text-white tracking-tight">Partner<span className="text-primary">Portal</span></span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('leads')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'leads' ? 'bg-primary text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5" /> All Leads
          </button>
          <button 
            onClick={() => setActiveTab('providers')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'providers' ? 'bg-primary text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <Users className="w-5 h-5" /> Local Providers
          </button>
          <button 
            onClick={() => setActiveTab('services')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'services' ? 'bg-primary text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <Briefcase className="w-5 h-5" /> Services Config
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-display font-bold text-slate-900 capitalize">
            {activeTab === 'leads' ? 'Lead Management' : activeTab === 'providers' ? 'Trusted Providers' : 'Service Categories'}
          </h1>
          <p className="text-slate-500 mt-1">Manage your drop-service business operations.</p>
        </header>

        {activeTab === 'leads' && <LeadsView />}
        {activeTab === 'providers' && <ProvidersView />}
        {activeTab === 'services' && <ServicesView />}
      </main>
    </div>
  )
}

// --- Views ---

function LeadsView() {
  const { data: leads, isLoading, refetch } = useListLeads();
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filteredLeads = leads?.filter(l => 
    l.customerName.toLowerCase().includes(search.toLowerCase()) || 
    l.serviceName.toLowerCase().includes(search.toLowerCase()) ||
    l.address.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Stats
  const total = leads?.length || 0;
  const newLeads = leads?.filter(l => l.status === 'new').length || 0;
  const forwarded = leads?.filter(l => l.status === 'forwarded').length || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Leads</p>
            <h3 className="text-3xl font-bold text-slate-900">{total}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center"><Users className="w-6 h-6" /></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">New Requests</p>
            <h3 className="text-3xl font-bold text-slate-900">{newLeads}</h3>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center"><Clock className="w-6 h-6" /></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Forwarded to Pros</p>
            <h3 className="text-3xl font-bold text-slate-900">{forwarded}</h3>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center"><Forward className="w-6 h-6" /></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search leads by name, service, or location..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-slate-50 border-slate-200"
            />
          </div>
          <Button variant="outline" className="gap-2 text-slate-600"><Filter className="w-4 h-4" /> Filter Status</Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Service Required</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" /></td></tr>
              ) : filteredLeads?.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-slate-500">No leads found.</td></tr>
              ) : (
                filteredLeads?.map((lead) => (
                  <tr key={lead.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{lead.customerName}</div>
                      <div className="text-xs text-slate-500">{lead.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">{lead.serviceName}</td>
                    <td className="px-6 py-4 text-slate-600 truncate max-w-[150px]">{lead.address}</td>
                    <td className="px-6 py-4 text-slate-500">{format(new Date(lead.createdAt), 'MMM d, yyyy')}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" size="sm" onClick={() => setSelectedLead(lead)}>
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ManageLeadDialog lead={selectedLead} onClose={() => setSelectedLead(null)} onSuccess={refetch} />
    </div>
  )
}

function ManageLeadDialog({ lead, onClose, onSuccess }: { lead: Lead | null, onClose: () => void, onSuccess: () => void }) {
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();
  const { data: providers } = useListProviders();
  
  const [status, setStatus] = useState<UpdateLeadStatus>(lead?.status as UpdateLeadStatus || 'new');
  const [notes, setNotes] = useState(lead?.adminNotes || '');
  const [providerId, setProviderId] = useState<number | undefined>(lead?.assignedProviderId);

  // Sync state when lead changes
  useEffect(() => {
    if (lead) {
      setStatus(lead.status as UpdateLeadStatus);
      setNotes(lead.adminNotes || '');
      setProviderId(lead.assignedProviderId);
    }
  }, [lead]);

  const handleSave = () => {
    if (!lead) return;
    updateLead.mutate({
      id: lead.id,
      data: {
        status,
        adminNotes: notes,
        assignedProviderId: providerId || undefined
      }
    }, {
      onSuccess: () => {
        onSuccess();
        onClose();
      }
    });
  };

  const handleDelete = () => {
    if (!lead || !confirm("Are you sure you want to delete this lead?")) return;
    deleteLead.mutate({ id: lead.id }, {
      onSuccess: () => {
        onSuccess();
        onClose();
      }
    });
  };

  const matchingProviders = providers?.filter(p => p.serviceIds?.includes(lead?.serviceId || 0));

  return (
    <Dialog open={!!lead} onOpenChange={(open) => !open && onClose()}>
      {lead && (
        <>
          <DialogHeader>
            <DialogTitle>Manage Lead #{lead.id}</DialogTitle>
            <DialogDescription>Update status or assign to a local provider.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-xl space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-slate-500 font-medium block">Customer</span><span className="font-semibold text-slate-900">{lead.customerName}</span></div>
                <div><span className="text-slate-500 font-medium block">Service</span><span className="font-semibold text-slate-900">{lead.serviceName}</span></div>
                <div><span className="text-slate-500 font-medium block">Contact</span><span>{lead.customerPhone} <br/> {lead.customerEmail}</span></div>
                <div><span className="text-slate-500 font-medium block">Location</span><span>{lead.address}</span></div>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500 font-medium block mb-1">Customer Notes</span>
                <p className="text-slate-700 bg-white p-3 border border-slate-200 rounded-lg">{lead.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Update Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value as UpdateLeadStatus)}
                  className="w-full h-11 rounded-lg border-2 border-input bg-background px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                >
                  <option value="new">New Request</option>
                  <option value="contacted">Contacted (In Progress)</option>
                  <option value="forwarded">Forwarded to Provider</option>
                  <option value="completed">Completed / Won</option>
                  <option value="cancelled">Cancelled / Lost</option>
                </select>
              </div>

              {(status === 'forwarded' || status === 'completed') && (
                <div>
                  <label className="block text-sm font-semibold mb-2">Assign Provider</label>
                  <select 
                    value={providerId || ""} 
                    onChange={(e) => setProviderId(Number(e.target.value))}
                    className="w-full h-11 rounded-lg border-2 border-input bg-background px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="">Select a provider...</option>
                    {matchingProviders?.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (⭐ {p.rating})</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2">Internal Admin Notes</label>
                <Textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Private notes about this lead..."
                  className="min-h-[80px]"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <Button variant="destructive" onClick={handleDelete} disabled={deleteLead.isPending}>
                Delete Lead
              </Button>
              <div className="space-x-3">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} disabled={updateLead.isPending}>
                  {updateLead.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </Dialog>
  )
}

function ProvidersView() {
  const { data: providers, isLoading, refetch } = useListProviders();
  const { data: services } = useListServices();
  const deleteProvider = useDeleteProvider();
  const createProvider = useCreateProvider();
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  // New provider form state
  const [name, setName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedServices, setSelectedServices] = useState<number[]>([]);

  const toggleService = (id: number) => {
    setSelectedServices(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleCreate = () => {
    createProvider.mutate({
      data: { name, contactName, phone, email, serviceIds: selectedServices, rating: 5.0 }
    }, {
      onSuccess: () => {
        setIsAddOpen(false);
        refetch();
        // reset
        setName(""); setContactName(""); setPhone(""); setEmail(""); setSelectedServices([]);
      }
    });
  };

  const handleDelete = (id: number) => {
    if(confirm("Delete this provider?")) {
      deleteProvider.mutate({ id }, { onSuccess: () => refetch() });
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Provider Network</h2>
        <Button onClick={() => setIsAddOpen(true)} className="gap-2"><Plus className="w-4 h-4" /> Add Provider</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : providers?.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">No providers added yet.</div>
        ) : (
          providers?.map(provider => (
            <div key={provider.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative group">
              <button 
                onClick={() => handleDelete(provider.id)}
                className="absolute top-4 right-4 text-slate-400 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete provider"
              >
                <XCircle className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                  {provider.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{provider.name}</h3>
                  <div className="flex items-center text-sm text-slate-500">
                    <Star className="w-3.5 h-3.5 text-amber-400 mr-1" /> {provider.rating || 'N/A'} Rating
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-slate-600 gap-2"><Users className="w-4 h-4 text-slate-400" /> {provider.contactName}</div>
                <div className="flex items-center text-sm text-slate-600 gap-2"><Phone className="w-4 h-4 text-slate-400" /> {provider.phone}</div>
                <div className="flex items-center text-sm text-slate-600 gap-2"><Mail className="w-4 h-4 text-slate-400" /> {provider.email}</div>
              </div>
              
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Services</p>
                <div className="flex flex-wrap gap-2">
                  {provider.serviceNames?.map((svc, i) => (
                    <Badge key={i} variant="secondary" className="bg-slate-100">{svc}</Badge>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogHeader>
          <DialogTitle>Add Trusted Provider</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Company Name" value={name} onChange={e => setName(e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <Input placeholder="Contact Person" value={contactName} onChange={e => setContactName(e.target.value)} />
            <Input placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <Input placeholder="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          
          <div>
            <label className="block text-sm font-semibold mb-2 mt-2">Services they provide</label>
            <div className="flex flex-wrap gap-2">
              {services?.map(s => (
                <button
                  key={s.id}
                  onClick={() => toggleService(s.id)}
                  className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${selectedServices.includes(s.id) ? 'bg-primary border-primary text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 space-x-3">
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={createProvider.isPending || !name || selectedServices.length === 0}>
              {createProvider.isPending ? "Adding..." : "Add Provider"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

function ServicesView() {
  const { data: services, isLoading, refetch } = useListServices();
  const createService = useCreateService();
  const deleteService = useDeleteService();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("wrench"); // default

  const handleCreate = () => {
    createService.mutate({
      data: { name, description, icon, active: true }
    }, {
      onSuccess: () => {
        setIsAddOpen(false);
        refetch();
        setName(""); setDescription(""); setIcon("wrench");
      }
    });
  };

  const handleDelete = (id: number) => {
    if(confirm("Delete this service? This may break leads tied to it.")) {
      deleteService.mutate({ id }, { onSuccess: () => refetch() });
    }
  };

  return (
    <div className="animate-in fade-in duration-300 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Service Categories</h2>
        <Button onClick={() => setIsAddOpen(true)} className="gap-2"><Plus className="w-4 h-4" /> New Service</Button>
      </div>

      <div className="divide-y divide-slate-100">
        {isLoading ? (
           <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : services?.map(service => (
          <div key={service.id} className="py-4 flex justify-between items-center group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                <Wrench className="w-5 h-5" /> {/* Generic icon fallback */}
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">{service.name}</h4>
                <p className="text-sm text-slate-500 line-clamp-1">{service.description}</p>
              </div>
            </div>
            <Button variant="ghost" className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDelete(service.id)}>
              Delete
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogHeader>
          <DialogTitle>Create Service Category</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Service Name (e.g. Locksmith)" value={name} onChange={e => setName(e.target.value)} />
          <Textarea placeholder="Description to show customers..." value={description} onChange={e => setDescription(e.target.value)} className="min-h-[100px]" />
          <div>
            <label className="text-sm font-medium mb-1 block">Icon Name (lucide)</label>
            <Input placeholder="e.g. wrench, car, home" value={icon} onChange={e => setIcon(e.target.value)} />
          </div>
          <div className="flex justify-end pt-4 space-x-3">
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={createService.isPending || !name}>
              {createService.isPending ? "Creating..." : "Create Service"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
