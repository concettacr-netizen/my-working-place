import React, { useState } from 'react';
import {
  Send,
  ArrowLeft,
  Search,
  CheckCheck,
  Paperclip,
  Users,
  Megaphone,
  Sparkles,
  ShieldAlert,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { Channel, ChatMessage, Notice } from '../../types';

interface BeskederScreenProps {
  channels: Channel[];
  chatMessages: Record<string, ChatMessage[]>;
  notices: Notice[];
  onSendMessage: (channelId: string, text: string) => void;
  onReadNotice: (id: string) => void;
}

export const BeskederScreen: React.FC<BeskederScreenProps> = ({
  channels,
  chatMessages,
  notices,
  onSendMessage,
  onReadNotice,
}) => {
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState<'chats' | 'opslag'>('chats');

  const selectedChannel = channels.find((c) => c.id === activeChannelId);
  const currentMessages = activeChannelId ? chatMessages[activeChannelId] || [] : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChannelId) return;
    onSendMessage(activeChannelId, inputText.trim());
    setInputText('');
  };

  if (activeChannelId && selectedChannel) {
    return (
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        {/* Chat Header */}
        <div className="bg-[#0F2744] text-white p-3.5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveChannelId(null)}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <img
              src={selectedChannel.avatar}
              alt={selectedChannel.title}
              className="w-9 h-9 rounded-full object-cover border border-white/20"
            />
            <div>
              <h3 className="text-sm font-bold leading-tight">{selectedChannel.title}</h3>
              <p className="text-[11px] text-emerald-400">{selectedChannel.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-36">
          <div className="text-center my-2">
            <span className="text-[11px] font-semibold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200">
              I dag, Tirsdag 3. nov
            </span>
          </div>

          {currentMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
            >
              {!msg.isMe && (
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-xs font-bold text-[#0F2744]">{msg.senderName}</span>
                  <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                </div>
              )}

              <div
                className={`max-w-[82%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                  msg.isMe
                    ? 'bg-[#0F2744] text-white rounded-tr-xs'
                    : 'bg-white text-[#0B192C] border border-[rgba(15,39,68,0.06)] rounded-tl-xs'
                }`}
              >
                {msg.text}

                {msg.attachment && (
                  <div className="mt-2.5 p-2 rounded-xl bg-white/10 border border-white/10 text-xs flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="font-bold">{msg.attachment.title}</div>
                      <div className="text-[10px] opacity-80">{msg.attachment.detail}</div>
                    </div>
                  </div>
                )}
              </div>

              {msg.isMe && (
                <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 px-1">
                  <span>{msg.timestamp}</span>
                  <CheckCheck className="w-3.5 h-3.5 text-[#10B981]" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Bar & Hurtigsvar Fixed */}
        <div className="fixed bottom-0 left-0 right-0 max-w-[430px] md:max-w-3xl mx-auto p-3 bg-white/95 backdrop-blur-md border-t border-[rgba(15,39,68,0.08)] shadow-lg z-30">
          {/* Hurtigsvar / Quick Replies Chips */}
          <div className="mb-2">
            <div className="flex items-center gap-1.5 mb-1 px-0.5">
              <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Hurtigsvar
              </span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {[
                { label: 'OK', icon: '👍', text: 'OK 👍' },
                { label: 'Er på vej', icon: '🏃‍♂️', text: 'Er på vej 🏃‍♂️' },
                { label: 'Har modtaget', icon: '📦', text: 'Har modtaget 📦' },
                { label: 'Går til pause', icon: '☕️', text: 'Går til pause ☕️' },
                { label: 'Port er klar', icon: '🚛', text: 'Porten er åben og klar 🚛' },
                { label: 'Godkendt', icon: '✅', text: 'Godkendt herfra ✅' },
              ].map((reply) => (
                <button
                  key={reply.label}
                  type="button"
                  onClick={() => onSendMessage(activeChannelId, reply.text)}
                  className="h-8 px-3 rounded-full bg-[#F1F5F9] hover:bg-[#ECFDF5] hover:border-[#10B981] border border-slate-200/80 text-xs font-semibold text-[#0F2744] hover:text-[#065F46] shrink-0 flex items-center gap-1.5 android-tap transition-all shadow-2xs"
                  title={`Send hurtigsvar: "${reply.text}"`}
                >
                  <span>{reply.icon}</span>
                  <span>{reply.label}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Skriv en besked til kolleger..."
              className="flex-1 h-[48px] px-4 rounded-2xl bg-[#F8FAFC] border border-[rgba(15,39,68,0.12)] text-xs sm:text-sm text-[#0B192C] focus:outline-none focus:border-[#1E3A8A]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-12 h-[48px] rounded-2xl bg-[#0F2744] hover:bg-[#0A1C30] text-white flex items-center justify-center disabled:opacity-40 transition-colors shadow-xs android-tap"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-2 px-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Kommunikation
          </span>
          <h1 className="text-2xl font-bold text-[#0F2744] tracking-tight">Beskeder & Opslag</h1>
        </div>
      </div>

      {/* Segmented control: Chats vs Opslag */}
      <div className="bg-[#F1F5F9] p-1 rounded-2xl flex gap-1">
        <button
          onClick={() => setActiveTab('chats')}
          className={`flex-1 h-[42px] rounded-xl text-xs font-bold transition-all ${
            activeTab === 'chats'
              ? 'bg-white text-[#0F2744] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Samtaler ({channels.length})
        </button>
        <button
          onClick={() => setActiveTab('opslag')}
          className={`flex-1 h-[42px] rounded-xl text-xs font-bold transition-all ${
            activeTab === 'opslag'
              ? 'bg-white text-[#0F2744] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Officielle Opslag ({notices.length})
        </button>
      </div>

      {activeTab === 'chats' ? (
        <div className="space-y-2">
          {channels.map((ch) => (
            <div
              key={ch.id}
              onClick={() => setActiveChannelId(ch.id)}
              className="p-3.5 bg-white rounded-2xl border border-[rgba(15,39,68,0.06)] nordic-card-shadow hover:border-slate-300 flex items-center justify-between gap-3 cursor-pointer android-tap transition-all"
            >
              <div className="relative shrink-0">
                <img
                  src={ch.avatar}
                  alt={ch.title}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                />
                {ch.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#10B981] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                    {ch.unreadCount}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-[#0F2744] truncate">{ch.title}</h4>
                  <span className="text-[10px] text-slate-400 shrink-0">{ch.lastTime}</span>
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">{ch.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Opslagstavle */
        <div className="space-y-3">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className={`p-4 rounded-2xl border bg-white nordic-card-shadow ${
                notice.urgent ? 'border-amber-200 bg-amber-50/20' : 'border-[rgba(15,39,68,0.06)]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    notice.category === 'Sikkerhed'
                      ? 'bg-amber-100 text-amber-900'
                      : notice.category === 'Drift'
                      ? 'bg-blue-100 text-blue-900'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {notice.category}
                </span>
                <span className="text-xs text-slate-400">{notice.date}</span>
              </div>

              <h4 className="text-sm font-bold text-[#0F2744]">{notice.title}</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notice.content}</p>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Udgivet af: {notice.author}</span>
                {notice.read ? (
                  <span className="text-xs text-[#065F46] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Læst
                  </span>
                ) : (
                  <button
                    onClick={() => onReadNotice(notice.id)}
                    className="h-8 px-3 rounded-xl bg-[#0F2744] text-white text-xs font-semibold shadow-xs"
                  >
                    Markér som læst
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
