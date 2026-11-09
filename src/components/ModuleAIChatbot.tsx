import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Mic,
  User,
  Loader2,
  HelpCircle,
  Volume2,
  RefreshCw,
  Copy,
  Check,
  Trash2,
} from 'lucide-react';
import { Language, ChatMessage } from '../types';
import { t } from '../translations';

interface ModuleAIChatbotProps {
  language: Language;
}

export const ModuleAIChatbot: React.FC<ModuleAIChatbotProps> = ({ language }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: t('aiGreeting', language),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language,
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const quickPrompts = [
    {
      en: "What are the eligibility criteria for Jagananna Vidya Deevena?",
      te: "జగనన్న విద్యా దీవెన పథకం అర్హతలు ఏమిటి?",
    },
    {
      en: "How do I raise a complaint for broken streetlights or drainage in my village?",
      te: "గ్రామంలో వీధి దీపాలు లేదా డ్రైనేజీ సమస్య వస్తే ఎలా ఫిర్యాదు చేయాలి?",
    },
    {
      en: "Where can I find an electrician or motor mechanic near Penumantra?",
      te: "పెనుమంత్ర సమీపంలో ఎలక్ట్రీషియన్ లేదా మోటార్ మెకానిక్ వివరాలు ఎలా పొందాలి?",
    },
    {
      en: "Tell me about AP Rythu Bharosa and PM-Kisan payment schedule.",
      te: "ఆంధ్రప్రదేశ్ రైతు భరోసా – పీఎం కిసాన్ పథకం వివరాలు చెప్పండి.",
    },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query, language }),
      });
      const data = await res.json();

      const aiReplyText =
        data.text ||
        (language === 'te'
          ? 'క్షమించండి, ప్రత్యుత్తరం తయారుచేయడంలో చిన్న సమస్య ఎదురైంది.'
          : 'Sorry, I could not generate a response right now.');

      const aiMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'ai',
        text:
          language === 'te'
            ? 'నమస్తే! AI సర్వర్‌ను సంప్రదించడంలో సమస్య ఉంది. కొన్ని క్షణాల తర్వాత మళ్లీ ప్రయత్నించండి.'
            : 'Connection error to AI service. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: String(Date.now()),
        sender: 'ai',
        text: t('aiGreeting', language),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language,
      },
    ]);
  };

  const simulateVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      const voiceSample =
        language === 'te'
          ? 'అమ్మ ఒడి పథకం అర్హతలు ఏమిటి?'
          : 'How to file a road pothole complaint?';
      setInputPrompt(voiceSample);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-200 my-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
              <Bot className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {t('aiTitle', language)}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gemini 3.6 Flash Powered Village Mitram (గ్రామ మిత్ర) in Telugu & English
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Clear Chat</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-purple-900 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>AP Schemes Knowledge Engine</span>
          </div>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
          Quick Questions / త్వరిత ప్రశ్నలు:
        </span>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((p, idx) => {
            const promptText = language === 'te' ? p.te : p.en;
            return (
              <button
                key={idx}
                id={`btn-quick-prompt-${idx}`}
                onClick={() => handleSendMessage(promptText)}
                className="text-xs font-medium bg-slate-100 hover:bg-purple-100 hover:text-purple-900 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200/80 transition-all text-left"
              >
                {promptText}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 sm:p-6 min-h-[380px] max-h-[500px] overflow-y-auto space-y-4 border border-slate-800 shadow-inner">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-purple-600 text-white'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed relative group ${
                msg.sender === 'user'
                  ? 'bg-teal-700 text-white rounded-tr-none'
                  : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-700/50 text-[10px] opacity-60">
                <span>{msg.timestamp}</span>
                {msg.sender === 'ai' && (
                  <button
                    onClick={() => copyToClipboard(msg.id, msg.text)}
                    className="hover:text-white flex items-center gap-1 opacity-80 hover:opacity-100"
                    title="Copy Answer"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold p-3 bg-slate-800/80 rounded-xl w-fit">
            <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
            <span>GramConnect AI is consulting AP Panchayat Records...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex gap-2 items-center"
      >
        <button
          type="button"
          onClick={simulateVoiceInput}
          className={`p-3 rounded-xl border transition-all cursor-pointer ${
            isListening
              ? 'bg-red-500 text-white border-red-400 animate-pulse'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
          }`}
          title="Voice Command Input"
        >
          <Mic className="w-4 h-4" />
        </button>

        <input
          id="ai-chat-input"
          type="text"
          placeholder={t('askPlaceholder', language)}
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          className="flex-1 p-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-600"
        />

        <button
          id="btn-ai-send"
          type="submit"
          disabled={isLoading || !inputPrompt.trim()}
          className="p-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
