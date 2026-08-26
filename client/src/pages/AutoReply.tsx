import { useEffect, useState } from 'react';
import { Loader2Icon, MessageSquareReplyIcon, PlusIcon, SaveIcon, Settings2Icon, TrashIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAutoReplySettings, updateAutoReplySettings, type AutoReplyRule } from '../api/autoReply.js';

export const AutoReply = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [mode, setMode] = useState<'keyword' | 'ai'>('keyword');
  const [aiPrompt, setAiPrompt] = useState(
    'Respond warmly and helpfully. Keep responses under 25 words and include a link if asked for info.'
  );
  const [rules, setRules] = useState<AutoReplyRule[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [newReply, setNewReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getAutoReplySettings();
        if (data) {
          setIsEnabled(data.isEnabled);
          setMode(data.mode || 'keyword');
          setAiPrompt(data.aiPrompt || aiPrompt);
          setRules(data.rules || []);
        }
      } catch (err) {
        console.error('Failed to load auto-reply settings', err);
        toast.error('Failed to load auto-reply settings.');
      } finally {
        setFetching(false);
      }
    };
    fetchSettings();
  }, []);

  const handleAddRule = () => {
    if (!newKeyword.trim() || !newReply.trim()) {
      toast.error('Please enter both a keyword and a reply.');
      return;
    }
    setRules([...rules, { keyword: newKeyword.trim().toLowerCase(), replyText: newReply.trim() }]);
    setNewKeyword('');
    setNewReply('');
  };

  const handleDeleteRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateAutoReplySettings({
        isEnabled,
        mode,
        aiPrompt: mode === 'ai' ? aiPrompt : undefined,
        rules: mode === 'keyword' ? rules : [],
      });
      toast.success('Auto Reply settings saved successfully!');
    } catch (err) {
      console.error('Failed to save settings', err);
      toast.error('Failed to save settings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2Icon className="size-6 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700'>
      {/* Header & Main Toggle Section */}
      <div className='space-y-4 mt-10'>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className='text-2xl text-slate-700 tracking-tight'>Auto Comment Reply</h1>
            <p className="text-slate-500 text-sm mt-1">
              Automatically respond to incoming comments on your connected accounts.
            </p>
          </div>

          {/* Main Status Toggle Switch */}
          <button 
            type="button" 
            onClick={() => setIsEnabled(!isEnabled)} 
            className='flex items-center gap-3 bg-white py-2 px-4 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors self-start sm:self-auto'
          >
            <span className="text-slate-600 font-medium text-sm">
              Status: {isEnabled ? 'Active' : 'Paused'}
            </span> 
            <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${isEnabled ? "bg-red-500" : "bg-slate-200"}`}>
              <span className={`pointer-events-none size-4 transform translate-y-0.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${isEnabled ? "translate-x-4.5" : "translate-x-0.5"}`}/>
            </div>
          </button>
        </div>
      </div>

      {/* Reply Strategy Strategy Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <h2 className="text-xl text-slate-700">Reply Strategy</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setMode('keyword')}
            className={`p-5 rounded-2xl border text-left transition-all ${
              mode === 'keyword'
                ? 'bg-red-50/50 border-red-200 shadow-sm'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <h3 className="font-semibold text-slate-700">Keyword Triggers</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Match specific phrases (e.g., "price", "link") and respond with pre-set templates.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setMode('ai')}
            className={`p-5 rounded-2xl border text-left transition-all ${
              mode === 'ai'
                ? 'bg-red-50/50 border-red-200 shadow-sm'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <h3 className="font-semibold text-slate-700">AI Context Responder</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Let an AI model analyze the comment and draft a contextual, natural reply.
            </p>
          </button>
        </div>

        {/* Keyword Mode Configuration */}
        {mode === 'keyword' && (
          <div className="space-y-6 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2 text-slate-600">
              <Settings2Icon className="size-5" />
              <h3 className="text-lg text-slate-700">Active Rules</h3>
            </div>
            
            {/* Add Rule Form */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Keyword (e.g., pricing)"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                className="w-full sm:w-1/3 px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm outline-none focus:border-slate-400 transition"
              />
              <input
                type="text"
                placeholder="Automated reply message..."
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                className="w-full sm:w-2/3 px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm outline-none focus:border-slate-400 transition"
              />
              <button
                type="button"
                onClick={handleAddRule}
                className="bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-500 flex items-center justify-center gap-2 px-5 py-3 rounded-xl transition-colors border border-transparent hover:border-red-100 shrink-0 text-sm font-medium"
              >
                <PlusIcon className="size-4" />
                Add
              </button>
            </div>

            {/* Rules List Grid */}
            <div className="space-y-3">
              {rules.map((rule, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-medium bg-red-50 text-red-500 uppercase tracking-wider">
                      Keyword: "{rule.keyword}"
                    </span>
                    <p className="text-sm text-slate-600 leading-relaxed">{rule.replyText}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteRule(idx)}
                    className="p-2.5 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                  >
                    <TrashIcon className="size-4" />
                  </button>
                </div>
              ))}

              {rules.length === 0 && (
                <div className='py-12 text-center space-y-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200'>
                  <div className='size-12 bg-white rounded-2xl flex items-center justify-center mx-auto text-slate-300 shadow-sm border border-slate-100'>
                    <MessageSquareReplyIcon className='size-6'/>
                  </div>
                  <p className="text-slate-500 text-sm">No keyword rules yet. Add your first rule above.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI Mode Configuration */}
        {mode === 'ai' && (
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2 text-slate-600">
              <Settings2Icon className="size-5" />
              <h3 className="text-lg text-slate-700">System Instructions & Tone</h3>
            </div>
            
            <div className="relative group">
              <textarea
                rows={4}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Instruct the AI on tone, guidelines, and what information to provide..."
                className="w-full px-4 py-4 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm outline-none focus:border-slate-400 transition resize-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Save Action Bar */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2 px-6 py-3 rounded-xl transition-all shadow-sm disabled:opacity-50 text-sm font-medium cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2Icon className='size-4 animate-spin'/>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <SaveIcon className='size-4'/>
              <span>Save Configuration</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AutoReply;