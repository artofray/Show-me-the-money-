
import React, { useState } from 'react';
import { Search, Loader2, Sparkles, Terminal, ArrowRight, Download } from 'lucide-react';
import { runAutonomousAgent } from '../services/geminiService';

const AnalysisPanel: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      const res = await runAutonomousAgent(query);
      setResult(res);
    } catch (err) {
      setResult("Error executing autonomous analysis. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportJSON = () => {
    if (!result) return;
    const exportData = {
      query,
      result,
      exportedAt: new Date().toISOString(),
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `autonomous_report_${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="glass rounded-2xl overflow-hidden border-emerald-500/20 mb-12">
      <div className="p-6 bg-gradient-to-r from-emerald-900/20 to-transparent border-b border-white/5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-emerald-400">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Autonomous Intelligence Unit</span>
          </div>
          {result && !loading && (
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-950/30 px-3 py-1.5 rounded-lg border border-emerald-500/30"
            >
              <Download className="w-4 h-4" /> EXPORT JSON
            </button>
          )}
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Investigate Policy Influence</h2>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Analyze the donors of politicians opposing cannabis rescheduling..."
            className="w-full bg-zinc-900/80 border border-zinc-700 rounded-xl py-4 pl-12 pr-32 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-white"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Execute Agent'}
          </button>
        </form>
      </div>

      <div className="p-6 bg-black/40 min-h-[100px] max-h-[500px] overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4 text-zinc-500">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
            <p className="animate-pulse">Accessing Federal Election Commission records and OpenSecrets data clusters...</p>
          </div>
        ) : result ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 bg-emerald-950/30 px-3 py-1 rounded w-fit">
              <Terminal className="w-3 h-3" /> ANALYSIS_COMPLETE
            </div>
            <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed">
              <div className="whitespace-pre-wrap font-mono text-sm border-l-2 border-emerald-500/30 pl-4">
                {result}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 flex flex-col justify-between">
              <p className="text-sm text-zinc-400 italic">"Who are the top Big Pharma donors for the 2025 House Committee members?"</p>
              <button 
                onClick={() => setQuery("Who are the top Big Pharma donors for the 2025 House Committee members?")}
                className="mt-4 text-emerald-500 text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all"
              >
                RUN TEMPLATE <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 flex flex-col justify-between">
              <p className="text-sm text-zinc-400 italic">"Follow the money behind anti-cannabis rescheduling lobbying."</p>
              <button 
                onClick={() => setQuery("Follow the money behind anti-cannabis rescheduling lobbying.")}
                className="mt-4 text-emerald-500 text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all"
              >
                RUN TEMPLATE <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPanel;
