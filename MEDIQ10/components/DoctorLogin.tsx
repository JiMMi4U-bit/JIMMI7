
import React, { useState } from 'react';
import { DOCTORS, TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface DoctorLoginProps {
  onLogin: (userData: any) => void;
  lang: Language;
  onBack: () => void;
}

export const DoctorLogin: React.FC<DoctorLoginProps> = ({ onLogin, lang, onBack }) => {
  const [username, setUsername] = useState('');
  const t = TRANSLATIONS[lang];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const doctor = DOCTORS.find(d => d.username.toLowerCase() === username.toLowerCase());
    if (doctor) {
      onLogin(doctor);
    } else {
      alert("Invalid doctor credentials. Hint: use 'sarah', 'james', or 'elena'");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-800 text-white">
      <button onClick={onBack} className="mb-6 text-slate-500 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        Back to Home
      </button>
      
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg rotate-3">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        </div>
        <h2 className="text-3xl font-black leading-tight">{t.doctorLogin}</h2>
        <p className="text-slate-400 mt-2 font-medium">Hospital Administration & Care</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Staff ID / Username</label>
          <input
            required
            type="text"
            className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-white placeholder:text-slate-600"
            placeholder="Enter 'sarah'"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40 mt-4 active:scale-[0.98]">
          Access Dashboard
        </button>
      </form>
      
      <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5">
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center mb-2">Security Notice</p>
        <p className="text-[10px] text-slate-400 leading-relaxed text-center">
          Unauthorized access is strictly prohibited. All activities are logged and monitored for patient safety.
        </p>
      </div>
    </div>
  );
};
