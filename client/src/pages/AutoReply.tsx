import React, { useEffect, useState } from 'react';
import { getAutoReplySettings, updateAutoReplySettings, type AutoReplyRule} from '../api/autoReply.js';

export const AutoReply: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [mode, setMode] = useState<'keyword' | 'ai'>('keyword');
  const [aiPrompt, setAiPrompt] = useState(
    'Respond warmly and helpfully. Keep responses under 25 words and include a link if asked for info.'
  );
  const [rules, setRules] = useState<AutoReplyRule[]>([
    
  ]);
  const [newKeyword, setNewKeyword] = useState('');
  const [newReply, setNewReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getAutoReplySettings();
        if (data) {
          setIsEnabled(data.isEnabled);
          setMode(data.mode || 'keyword');
          setAiPrompt(data.aiPrompt || '');
          setRules(data.rules || []);
        }
      } catch (err) {
        console.error('Failed to load auto-reply settings', err);
      }
    };
    fetchSettings();
  }, []);

  const handleAddRule = () => {
    if (!newKeyword.trim() || !newReply.trim()) return;
    setRules([...rules, { keyword: newKeyword.trim().toLowerCase(), replyText: newReply.trim() }]);
    setNewKeyword('');
    setNewReply('');
  };

  const handleDeleteRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setLoading(true);
    setSavedSuccess(false);
    try {
      await updateAutoReplySettings({
        isEnabled,
        mode,
        aiPrompt: mode === 'ai' ? aiPrompt : undefined,
        rules: mode === 'keyword' ? rules : [],
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save settings', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header & Main Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6 dark:border-gray-800">
        <div>
          <h1 className="text-2xl text-slate-700 ">Auto Comment Reply</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Automatically respond to incoming comments on your connected accounts.
          </p>
        </div>
        <div className="flex items-center gap-3">
        <button type="button" onClick={() => setIsEnabled(!isEnabled)} className='flex items-center gap-3 bg-red-50 py-2 px-3 rounded-xl'>
        <span className="text-sm font-medium text-gray-700">
            {isEnabled ? 'Enabled' : 'Disabled'}
          </span>
                   <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer
                    rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${isEnabled ? "bg-red-500" : "bg-slate-200"}`}>
                    <span className={`pointer-events-none size-4 transform translate-y-0.5
                        rounded-full bg-white transition ${isEnabled ? "translate-x-4.5" : "translate-x-0.5"}`}/>
                   </div>
                </button>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <h2 className="text-lg font-semibold text-slate-700">Reply Strategy</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setMode('keyword')}
            className={`p-4 rounded-xl border text-left transition-all ${
              mode === 'keyword'
                ? 'bg-white-50 border-gray-900'
                : 'border-gray-200 hover:border-red-500'
            }`}
          >
            <h3 className="font-semibold text-slate-700">Keyword Triggers</h3>
            <p className="text-xs text-slate-700 mt-1">
              Match specific phrases (e.g., "price", "link") and respond with pre-set templates.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setMode('ai')}
            className={`p-4 rounded-xl border text-left transition-all ${
              mode === 'ai'
                ? 'bg-white-50 border-gray-900'
                : 'border-gray-200 hover:border-red-500'
            }`}
          >
            <h3 className="font-semibold text-slate-700">AI Context Responder</h3>
            <p className="text-xs text-slate-700 mt-1">
              Let an AI model analyze the comment and draft a contextual, natural reply.
            </p>
          </button>
        </div>

        {/* Keyword Mode Configuration */}
        {mode === 'keyword' && (
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-slate-700">Active Rules</h3>
            
            <div className="space-y-3">
              {rules.map((rule, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-200 gap-3"
                >
                  <div className="space-y-1">
                    <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-white-50 text-slate-700 border border-gray-300">
                      If contains: "{rule.keyword}"
                    </span>
                    <p className="text-sm text-slate-700">{rule.replyText}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteRule(idx)}
                    className="text-xs text-red-600 hover:text-red-700 font-medium self-end sm:self-center"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>

            {/* Add Rule Form */}
            <div className="pt-3 flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Keyword (e.g., pricing)"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                className="w-full sm:w-1/3 px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:border-slate-400"
              />
              <input
                type="text"
                placeholder="Automated reply message..."
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                className="w-full sm:w-2/3 px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:border-slate-400"
              />
              <button
                type="button"
                onClick={handleAddRule}
                className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:opacity-90 whitespace-nowrap"
              >
                Add Rule
              </button>
            </div>
          </div>
        )}

        {/* AI Mode Configuration */}
        {mode === 'ai' && (
          <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                System Instructions & Tone
              </label>
              <textarea
                rows={4}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Instruct the AI on tone, guidelines, and what information to provide..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white text-slate-700 focus:border-slate-400"
              />
            </div>
          </div>
        )}
      </div>

      {/* Save Action Bar */}
      <div className="flex items-center justify-end gap-3">
        {savedSuccess && (
          <span className="text-sm text-green-600 dark:text-green-400 font-medium">
            Settings saved successfully!
          </span>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium text-sm rounded-xl shadow-sm transition-all disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};