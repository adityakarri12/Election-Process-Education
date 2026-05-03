import { useState } from 'react';
import { MapPin, Search, Landmark, User, ExternalLink, Mail, Phone } from 'lucide-react';

export const CivicLookup = () => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = import.meta.env.VITE_GOOGLE_CIVIC_API_KEY;

  const handleSearch = async () => {
    if (!address.trim()) return;
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://www.googleapis.com/civicinfo/v2/representatives?address=${encodeURIComponent(address)}&key=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch data. Please check your address or API key.');
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
          <Landmark size={14} /> Real-Time Civic Data
        </div>
        <h2 className="text-4xl font-bold font-display mb-4">Find Your Representatives</h2>
        <p className="text-slate-400">
          Enter your residential address to fetch real-time data on your elected officials from the Google Civic Information database.
        </p>
      </div>

      <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-3 mb-12">
        <div className="relative flex-grow">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text" 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Street, City, State, ZIP..."
            className="w-full bg-slate-950 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary transition-all shadow-inner"
          />
        </div>
        <button 
          onClick={handleSearch}
          disabled={loading || !address.trim()}
          className="bg-primary hover:bg-primary-hover text-white font-bold px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? "Fetching..." : <><Search size={20} /> Search</>}
        </button>
      </div>

      {error && (
        <div className="max-w-2xl mx-auto p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center mb-8">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-12 animate-fade-in">
          {/* Group officials by office */}
          {result.offices.map((office: any, idx: number) => (
            <div key={idx} className="space-y-6">
              <h3 className="text-xl font-bold border-l-4 border-primary pl-4">{office.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {office.officialIndices.map((index: number) => {
                  const official = result.officials[index];
                  return (
                    <div key={index} className="bg-slate-950 border border-white/5 rounded-2xl p-6 hover:border-primary/30 transition-colors group">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-slate-800 overflow-hidden flex-shrink-0 shadow-lg">
                          {official.photoUrl ? (
                            <img src={official.photoUrl} alt={official.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                              <User size={32} />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{official.name}</h4>
                          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{official.party}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3 pt-4 border-t border-white/5">
                        {official.urls && official.urls[0] && (
                          <a href={official.urls[0]} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-slate-400 hover:text-white">
                            <ExternalLink size={14} className="text-primary" /> Official Website
                          </a>
                        )}
                        {official.phones && official.phones[0] && (
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Phone size={14} className="text-primary" /> {official.phones[0]}
                          </div>
                        )}
                        {official.emails && official.emails[0] && (
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Mail size={14} className="text-primary" /> {official.emails[0]}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
