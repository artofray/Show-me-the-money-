
import React, { useState, useMemo } from 'react';
import { SEED_POLITICIANS } from './constants';
import { Politician } from './types';
import PoliticianCard from './components/PoliticianCard';
import ProfileDetail from './components/ProfileDetail';
import AnalysisPanel from './components/AnalysisPanel';
import { Search, Filter, ShieldCheck, DollarSign, Activity } from 'lucide-react';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPolitician, setSelectedPolitician] = useState<Politician | null>(null);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Republican' | 'Democrat'>('All');

  const filteredPoliticians = useMemo(() => {
    return SEED_POLITICIANS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.state.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === 'All' || p.party === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter]);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-100">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">MoneyTrails</h1>
              <p className="text-[10px] text-emerald-500 font-mono uppercase tracking-widest leading-none">Political Intelligence Unit</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#" className="text-white hover:text-emerald-400 transition-colors">Politicians</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Industries</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Lobbying</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Methods</a>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-emerald-900/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              SECURE
            </div>
          </div>
        </div>
      </nav>

      {/* Hero / Header */}
      <div className="relative py-16 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/10 via-transparent to-transparent opacity-50 -z-10" />
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-black text-white mb-6 tracking-tight">
            Follow the <span className="text-emerald-500">Money.</span> <br /> 
            Expose the <span className="text-blue-500">Influence.</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Leveraging Gemini Search Grounding to track real-time campaign contributions, industry ties, and lobbying efforts in U.S. politics.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 pb-24">
        {/* Autonomous Agent Section */}
        <AnalysisPanel />

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
            <input 
              type="text"
              placeholder="Search politician or state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-white"
            />
          </div>
          
          <div className="flex gap-2 p-1 bg-zinc-900/50 rounded-xl border border-zinc-800">
            {['All', 'Republican', 'Democrat'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter as any)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeFilter === filter 
                    ? 'bg-emerald-600 text-white shadow-lg' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass p-6 rounded-2xl border-l-4 border-emerald-500">
            <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Live Tracking
            </div>
            <div className="text-3xl font-bold text-white mb-1">{SEED_POLITICIANS.length}</div>
            <div className="text-sm text-zinc-400">High-profile officials tracked</div>
          </div>
          <div className="glass p-6 rounded-2xl border-l-4 border-amber-500">
            <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Capital Flow
            </div>
            <div className="text-3xl font-bold text-white mb-1">$2.4B+</div>
            <div className="text-sm text-zinc-400">Estimated industry lobbying (2025)</div>
          </div>
          <div className="glass p-6 rounded-2xl border-l-4 border-blue-500">
            <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Sector Focus
            </div>
            <div className="text-3xl font-bold text-white mb-1">Cannabis</div>
            <div className="text-sm text-zinc-400">Current priority legislative focus</div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPoliticians.map((p) => (
            <PoliticianCard 
              key={p.id} 
              politician={p} 
              onClick={setSelectedPolitician}
            />
          ))}
          {filteredPoliticians.length === 0 && (
            <div className="col-span-full py-20 text-center text-zinc-500 font-medium">
              No investigative records found matching your criteria.
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="bg-zinc-800 p-1.5 rounded-lg">
              <DollarSign className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="font-bold text-white">MoneyTrails</span>
          </div>
          <p className="text-zinc-500 text-sm">
            Powered by OpenSecrets, FEC Data, and Gemini 3-Pro-Preview. <br />
            Investigative journalism automated for the modern era.
          </p>
          <div className="flex gap-6 text-sm text-zinc-400">
            <a href="#" className="hover:text-white">API Access</a>
            <a href="#" className="hover:text-white">Data Sources</a>
            <a href="#" className="hover:text-white">Privacy</a>
          </div>
        </div>
      </footer>

      {/* Detail Modal */}
      {selectedPolitician && (
        <ProfileDetail 
          politician={selectedPolitician} 
          onClose={() => setSelectedPolitician(null)} 
        />
      )}
    </div>
  );
};

export default App;
