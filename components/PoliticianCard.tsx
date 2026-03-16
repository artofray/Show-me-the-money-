
import React, { useState, useEffect } from 'react';
import { Politician, DonorIndustry } from '../types';
import { User, MapPin, Building2, ExternalLink, Loader2, DollarSign } from 'lucide-react';
import { analyzePolitician } from '../services/geminiService';

interface PoliticianCardProps {
  politician: Politician;
  onClick: (politician: Politician) => void;
}

const PoliticianCard: React.FC<PoliticianCardProps> = ({ politician, onClick }) => {
  const [industries, setIndustries] = useState<DonorIndustry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchSummary = async () => {
      try {
        // Fetching a quick analysis for the card view
        const result = await analyzePolitician(politician.name, `Quick industry lookup for ${politician.name}`);
        if (isMounted) {
          setIndustries(result.donors.slice(0, 3));
          setLoading(false);
        }
      } catch (error) {
        console.error("Card Analysis Error:", error);
        if (isMounted) setLoading(false);
      }
    };

    fetchSummary();
    return () => { isMounted = false; };
  }, [politician.name]);

  return (
    <div 
      onClick={() => onClick(politician)}
      className="glass p-5 rounded-xl cursor-pointer hover:border-emerald-500/50 transition-all duration-300 group flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="bg-zinc-800 p-3 rounded-lg group-hover:bg-emerald-900/30 transition-colors">
          <User className="w-6 h-6 text-emerald-400" />
        </div>
        <div className="flex flex-col items-end">
          <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${
            politician.party === 'Republican' ? 'bg-red-900/20 text-red-400 border border-red-500/30' : 'bg-blue-900/20 text-blue-400 border border-blue-500/30'
          }`}>
            {politician.party}
          </span>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
        {politician.name}
      </h3>
      
      <div className="space-y-1 text-xs text-zinc-400 mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-3 h-3 text-zinc-500" />
          <span>{politician.state}</span>
        </div>
        <div className="flex items-center gap-2">
          <Building2 className="w-3 h-3 text-zinc-500" />
          <span>{politician.chamber}</span>
        </div>
      </div>

      {/* Top Industries Section */}
      <div className="flex-1 border-t border-white/5 pt-4">
        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1">
          <DollarSign className="w-3 h-3" /> Top Donors
        </div>
        
        {loading ? (
          <div className="flex items-center gap-2 text-[10px] text-zinc-600 animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Analyzing financials...</span>
          </div>
        ) : industries.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {industries.map((ind, idx) => (
              <span 
                key={idx} 
                className="bg-zinc-800/80 text-zinc-300 text-[9px] px-2 py-0.5 rounded border border-white/5 whitespace-nowrap"
              >
                {ind.industry}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-[10px] text-zinc-600 italic">No data found</span>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-bold text-zinc-500">
        <span className="flex items-center gap-1 group-hover:text-emerald-500 transition-colors uppercase tracking-tighter">
          Deep Analysis <ExternalLink className="w-2.5 h-2.5" />
        </span>
      </div>
    </div>
  );
};

export default PoliticianCard;
