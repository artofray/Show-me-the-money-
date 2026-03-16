
import React, { useState, useEffect } from 'react';
import { X, ExternalLink, ShieldAlert, BadgeDollarSign, Info, Loader2, Globe, Download } from 'lucide-react';
import { Politician, AnalysisResult } from '../types';
import { analyzePolitician } from '../services/geminiService';
import DonationChart from './DonationChart';

interface ProfileDetailProps {
  politician: Politician;
  onClose: () => void;
}

const ProfileDetail: React.FC<ProfileDetailProps> = ({ politician, onClose }) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await analyzePolitician(politician.name, `Member of House from ${politician.state}`);
        setAnalysis(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [politician]);

  const handleExportJSON = () => {
    if (!analysis) return;
    const exportData = {
      politician,
      analysis,
      exportedAt: new Date().toISOString(),
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${politician.name.replace(/\s+/g, '_')}_analysis.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl relative shadow-2xl border-emerald-500/30">
        <div className="absolute top-6 right-6 flex items-center gap-2 z-10">
          {analysis && !loading && (
            <button 
              onClick={handleExportJSON}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-emerald-400 hover:text-emerald-300"
              title="Export JSON"
            >
              <Download className="w-5 h-5" />
            </button>
          )}
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row gap-8 mb-12 items-start">
            <div className="w-32 h-32 bg-emerald-950/50 rounded-2xl flex items-center justify-center border border-emerald-500/30">
              <BadgeDollarSign className="w-16 h-16 text-emerald-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                  politician.party === 'Republican' ? 'bg-red-900/30 text-red-400' : 'bg-blue-900/30 text-blue-400'
                }`}>
                  {politician.party} Party
                </span>
                <span className="text-zinc-500 text-sm">{politician.chamber} • {politician.state}</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">{politician.name}</h1>
              <div className="flex flex-wrap gap-4">
                <a 
                  href={politician.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  Official Website <Globe className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
              <p className="text-zinc-400 font-medium animate-pulse">Running financial fingerprint analysis...</p>
            </div>
          ) : analysis ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column: Charts and Stats */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                    <BadgeDollarSign className="w-5 h-5 text-emerald-500" />
                    Top Donor Industries (Cycle Est.)
                  </h3>
                  <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
                    <DonationChart data={analysis.donors} />
                    <div className="mt-6 grid grid-cols-1 gap-2">
                      {analysis.donors.map((d, i) => (
                        <div key={i} className="flex justify-between items-center text-sm py-2 border-b border-white/5 last:border-0">
                          <span className="text-zinc-400">{d.industry}</span>
                          <span className="text-white font-mono font-bold">${d.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                    <Info className="w-5 h-5 text-blue-400" />
                    Verified Sources
                  </h3>
                  <div className="space-y-2">
                    {analysis.sources.map((s, i) => (
                      <a 
                        key={i} 
                        href={s.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-zinc-900/30 rounded-lg border border-zinc-800 hover:bg-zinc-800 transition-colors text-xs text-zinc-400"
                      >
                        {s.title} <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: AI Insights */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                    <ShieldAlert className="w-5 h-5 text-amber-500" />
                    Autonomous Analysis Summary
                  </h3>
                  <p className="text-zinc-300 leading-relaxed bg-amber-900/10 border border-amber-900/30 p-4 rounded-xl">
                    {analysis.summary}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Conflict Interest & Policy Influence</h3>
                  <ul className="space-y-4">
                    {analysis.keyInsights.map((insight, i) => (
                      <li key={i} className="flex gap-4 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-zinc-300 leading-snug">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-zinc-500">
              Failed to load financial analysis data.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
