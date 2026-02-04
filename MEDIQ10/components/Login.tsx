
import React, { useState } from 'react';
import { DOCTORS, TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface LoginProps {
  onLogin: (role: 'patient' | 'doctor', userData: any) => void;
  lang: Language;
}

export const Login: React.FC<LoginProps> = ({ onLogin, lang }) => {
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [username, setUsername] = useState('');
  const t = TRANSLATIONS[lang];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'doctor') {
      const doctor = DOCTORS.find(d => d.username.toLowerCase() === username.toLowerCase());
      if (doctor) {
        onLogin('doctor', doctor);
      } else {
        alert("Invalid doctor username. Try 'sarah' or 'james'");
      }
    } else {
      // For demo, patient login just accepts any phone number as username
      onLogin('patient', { name: username || 'Guest Patient', phone: username });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl shadow-2xl border border-slate-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900">{t.welcome}</h2>
        <p className="text-slate-500 mt-2">Please sign in to continue</p>
      </div>

      <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
        <button 
          onClick={() => setRole('patient')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${role === 'patient' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
        >
          {t.patientLogin}
        </button>
        <button 
          onClick={() => setRole('doctor')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${role === 'doctor' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
        >
          {t.doctorLogin}
        </button>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {role === 'doctor' ? 'Username' : 'Phone Number'}
          </label>
          <input
            required
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder={role === 'doctor' ? "Enter 'sarah'" : "Enter phone number"}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
          Login
        </button>
      </form>
    </div>
  );
};
