
import React, { useState, useEffect, useRef } from 'react';
import { appointmentService } from '../services/appointmentService';
import { Appointment, ChatMessage } from '../types';

interface ChatRoomProps {
  appointmentId: string;
  currentRole: 'patient' | 'doctor';
  theme: 'light' | 'dark';
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ appointmentId, currentRole, theme }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [showPrescriptionInput, setShowPrescriptionInput] = useState(false);
  const [rxInput, setRxInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMessages = () => {
      const appt = appointmentService.getAppointments().find(a => a.id === appointmentId);
      if (appt && appt.chatHistory) {
        setMessages(appt.chatHistory);
      }
    };

    loadMessages();
    const interval = setInterval(loadMessages, 2000); // Polling for updates
    return () => clearInterval(interval);
  }, [appointmentId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    appointmentService.addChatMessage(appointmentId, currentRole, input, false);
    setInput('');
    reloadMessages();
  };

  const handleSendPrescription = () => {
    if (!rxInput.trim()) return;
    appointmentService.addChatMessage(appointmentId, 'doctor', rxInput, true);
    setRxInput('');
    setShowPrescriptionInput(false);
    reloadMessages();
  };

  const reloadMessages = () => {
    const appt = appointmentService.getAppointments().find(a => a.id === appointmentId);
    if (appt?.chatHistory) setMessages(appt.chatHistory);
  };

  const isDark = theme === 'dark';

  return (
    <div className={`flex flex-col h-[450px] rounded-2xl border overflow-hidden shadow-inner relative ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
      {/* Prescription Form Overlay */}
      {showPrescriptionInput && (
        <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex items-end p-4 animate-in fade-in duration-200">
          <div className={`w-full p-6 rounded-3xl shadow-2xl animate-in slide-in-from-bottom-8 duration-300 ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}`}>
            <div className="flex justify-between items-center mb-4">
               <h5 className={`font-black text-xs uppercase tracking-widest flex items-center gap-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                 Issue Prescription
               </h5>
               <button onClick={() => setShowPrescriptionInput(false)} className="text-slate-500 hover:text-red-500">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>
            <textarea
              autoFocus
              className={`w-full p-4 rounded-2xl text-sm mb-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[150px] ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
              placeholder="List medicines, dosage, and frequency..."
              value={rxInput}
              onChange={(e) => setRxInput(e.target.value)}
            />
            <button 
              onClick={handleSendPrescription}
              className="w-full bg-blue-600 text-white py-3 rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all"
            >
              Send Official Prescription
            </button>
          </div>
        </div>
      )}

      <div className={`p-3 border-b flex justify-between items-center ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
        <h4 className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Direct Consultation Channel
        </h4>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Live</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {messages.length === 0 ? (
          <div className="text-center py-10 opacity-30">
            <svg className={`w-10 h-10 mx-auto mb-2 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-xs font-bold uppercase tracking-widest">No messages yet</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderRole === currentRole;
            const isRx = msg.isPrescription;
            
            if (isRx) {
              return (
                <div key={msg.id} className="flex flex-col items-center py-2 animate-in fade-in zoom-in duration-300">
                  <div className={`max-w-[90%] w-full rounded-2xl border-2 border-dashed p-4 relative overflow-hidden ${isDark ? 'bg-blue-900/10 border-blue-800' : 'bg-blue-50/50 border-blue-200 shadow-sm'}`}>
                    <div className="flex justify-between items-start mb-3 relative z-10">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-black italic">Rx</div>
                        <div>
                          <p className={`text-[10px] font-black uppercase tracking-tighter ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Official Prescription</p>
                          <p className={`text-[9px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{msg.timestamp}</p>
                        </div>
                      </div>
                      <div className="bg-green-500/10 text-green-500 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border border-green-500/20">
                        Verified
                      </div>
                    </div>
                    <p className={`text-sm font-bold whitespace-pre-wrap leading-relaxed relative z-10 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                      {msg.text}
                    </p>
                    <div className="mt-4 pt-3 border-t border-blue-200/20 flex justify-between items-center opacity-40">
                       <span className="text-[8px] font-bold uppercase tracking-widest">Digital Healthcare Solutions</span>
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 p-2 opacity-[0.03] rotate-12">
                       <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L12.586 10l-6.293 6.293A1 1 0 107.707 17.707l7-7a1 1 0 000-1.414l-7-7A1 1 0 007 2z" clipRule="evenodd" /></svg>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm font-medium ${
                  isMe 
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-500/10' 
                    : (isDark ? 'bg-slate-800 text-slate-100 rounded-tl-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm')
                }`}>
                  {msg.text}
                </div>
                <span className="text-[9px] font-bold text-slate-500 uppercase mt-1 px-1">
                  {isMe ? 'You' : (msg.senderRole === 'doctor' ? 'Doctor' : 'Patient')} • {msg.timestamp}
                </span>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSend} className={`p-3 border-t ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
        <div className="flex gap-2 relative">
          {currentRole === 'doctor' && (
            <button 
              type="button"
              onClick={() => setShowPrescriptionInput(true)}
              title="Issue Prescription"
              className={`p-2.5 rounded-xl border transition-all ${isDark ? 'bg-slate-900 border-slate-700 text-blue-400 hover:border-blue-500' : 'bg-slate-50 border-slate-200 text-blue-600 hover:border-blue-500'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </button>
          )}
          <div className="flex-1 relative">
            <input
              type="text"
              className={`w-full pl-4 pr-12 py-2.5 rounded-xl text-sm outline-none transition-all ${
                isDark 
                  ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500' 
                  : 'bg-slate-50 border-slate-100 text-slate-900 focus:border-blue-500'
              }`}
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              type="submit"
              className="absolute right-1.5 top-1.5 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
