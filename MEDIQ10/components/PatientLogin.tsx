
import React, { useState } from 'react';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface PatientLoginProps {
  onLogin: (userData: any) => void;
  lang: Language;
  onBack: () => void;
}

export const PatientLogin: React.FC<PatientLoginProps> = ({ onLogin, lang, onBack }) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const t = TRANSLATIONS[lang];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ name: name || 'Guest Patient', phone: phone });
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-[2.5rem] shadow-2xl border border-blue-50">
      <button onClick={onBack} className="mb-6 text-slate-400 hover:text-blue-600 flex items-center gap-2 text-sm font-medium transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        Back to Home
      </button>
      
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-inner">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        </div>
        <h2 className="text-3xl font-black text-slate-900 leading-tight">{t.patientLogin}</h2>
        <p className="text-slate-500 mt-2 font-medium">Access your health records & book visits</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{t.name}</label>
          <input
            required
            type="text"
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{t.phone}</label>
          <input
            required
            type="tel"
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
            placeholder="+91 00000 00000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 mt-4 active:scale-[0.98]">
          Continue to Portal
        </button>
      </form>
    </div>
  );
};
