
import React, { useState, useEffect } from 'react';
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { PatientLogin } from './components/PatientLogin';
import { DoctorLogin } from './components/DoctorLogin';
import { Language } from './types';
import { APP_NAME, TRANSLATIONS, DOCTORS } from './constants';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<'patient' | 'doctor' | null>(null);
  const [view, setView] = useState<string>('landing');
  const [aiConnected, setAiConnected] = useState<boolean>(false);

  useEffect(() => {
    const checkAiKey = async () => {
      if (typeof window !== 'undefined' && (window as any).aistudio?.hasSelectedApiKey) {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        setAiConnected(hasKey);
      }
    };
    checkAiKey();
    // Check periodically for demo purposes
    const interval = setInterval(checkAiKey, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleConnectAI = async () => {
    if (typeof window !== 'undefined' && (window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      setAiConnected(true); // Assume success as per race condition rules
    }
  };

  const t = TRANSLATIONS[lang];

  const handlePatientLogin = (userData: any) => {
    setUser(userData);
    setRole('patient');
    setView('patient-dash');
  };

  const handleDoctorLogin = (userData: any) => {
    setUser(userData);
    setRole('doctor');
    setView('doctor-dash');
  };

  const handleLogout = () => {
    setUser(null);
    setRole(null);
    setView('landing');
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${role === 'doctor' ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Dynamic Navbar */}
      <nav className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        role === 'doctor' 
          ? 'bg-slate-900/80 border-slate-800 text-white' 
          : 'bg-white/80 border-slate-200 text-slate-900'
      } backdrop-blur-xl`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div 
              className="flex items-center gap-3 cursor-pointer group" 
              onClick={() => {
                if(!role) setView('landing');
              }}
            >
              <div className="bg-blue-600 p-2.5 rounded-2xl group-hover:bg-blue-700 transition-all rotate-3 group-hover:rotate-0 shadow-lg shadow-blue-400/20">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter leading-none">{APP_NAME}</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${aiConnected ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-50 text-current">
                    AI {aiConnected ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              {!aiConnected && (
                <button 
                  onClick={handleConnectAI}
                  className={`hidden md:flex items-center gap-2 text-xs font-black border px-3 py-1.5 rounded-xl transition-all ${
                    role === 'doctor' 
                      ? 'text-blue-400 border-blue-900 hover:bg-white/5' 
                      : 'text-blue-600 border-blue-200 hover:bg-blue-50'
                  }`}
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM5.884 6.607a1 1 0 01-.211 1.397l-.82.614a1 1 0 11-1.186-1.614l.82-.614a1 1 0 011.397.211zM14.73 4.492a1 1 0 01.396 1.355l-.613.82a1 1 0 11-1.614-1.186l.613-.82a1 1 0 011.355-.396zM7 10a3 3 0 116 0 3 3 0 01-6 0zM18 9a1 1 0 100 2h-1a1 1 0 100-2h1zM5 9a1 1 0 100 2H4a1 1 0 100-2h1zM9 15a1 1 0 100 2h1a1 1 0 100-2H9zM16.273 15.68a1 1 0 01-1.397.21l-.82-.614a1 1 0 111.187-1.614l.82.614a1 1 0 01.21 1.397zM6.12 14.886a1 1 0 01-.396 1.355l-.82.613a1 1 0 11-1.186-1.614l.82-.613a1 1 0 011.355.396z" /></svg>
                  Connect AI
                </button>
              )}

              <div className={`flex items-center rounded-2xl p-1 gap-1 ${role === 'doctor' ? 'bg-slate-800' : 'bg-slate-100'}`}>
                {(['en', 'hi', 'mr', 'ta'] as Language[]).map(l => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                      lang === l 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : (role === 'doctor' ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-800')
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>

              {user ? (
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-6 py-2.5 rounded-2xl text-sm font-black shadow-lg hover:bg-red-600 transition-all"
                >
                  Logout
                </button>
              ) : (
                <div className="flex gap-2">
                  <button 
                    onClick={() => setView('doctor-login')}
                    className="hidden sm:block text-slate-500 hover:text-blue-600 text-sm font-black transition-colors"
                  >
                    {t.mgmtPortal}
                  </button>
                  <button 
                    onClick={() => setView('patient-login')}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-2xl text-sm font-black shadow-xl hover:bg-blue-700 transition-all"
                  >
                    Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {view === 'landing' && (
          <div className="space-y-32 animate-in fade-in duration-1000">
            {/* Hero Section */}
            <section className="text-center max-w-4xl mx-auto space-y-10 pt-12">
              <div className="inline-flex items-center bg-blue-50 text-blue-600 px-6 py-2.5 rounded-full text-xs font-black tracking-widest uppercase shadow-sm border border-blue-100">
                Hospital Management Reimagined
              </div>
              <h1 className="text-6xl sm:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter">
                {t.welcome} <br />
                <span className="text-blue-600">{t.tagline}</span>
              </h1>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                Choose your portal below to begin. Secure access for patients and medical staff with integrated AI triage.
              </p>
              
              <div className="flex flex-wrap justify-center gap-8 pt-8">
                <div 
                  onClick={() => setView('patient-login')}
                  className="group cursor-pointer bg-white p-10 rounded-[3rem] shadow-2xl shadow-blue-500/5 border border-slate-100 w-full sm:w-[320px] transition-all hover:scale-105 hover:border-blue-500 active:scale-95"
                >
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 transition-transform">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">{t.patientLogin}</h3>
                  <p className="text-slate-400 text-sm font-medium">Book visits and see records</p>
                </div>

                <div 
                  onClick={() => setView('doctor-login')}
                  className="group cursor-pointer bg-slate-900 p-10 rounded-[3rem] shadow-2xl shadow-slate-950/20 border border-slate-800 w-full sm:w-[320px] transition-all hover:scale-105 hover:border-blue-500 active:scale-95"
                >
                  <div className="w-16 h-16 bg-white text-slate-900 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 group-hover:-rotate-6 transition-transform">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">{t.doctorLogin}</h3>
                  <p className="text-slate-500 text-sm font-medium">Manage patients & charts</p>
                </div>
              </div>
            </section>

            {/* Feature Section */}
            <section className="grid lg:grid-cols-3 gap-12">
               <div className="space-y-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-black">01</div>
                  <h4 className="text-xl font-black text-slate-900">Multilingual Care</h4>
                  <p className="text-slate-500 leading-relaxed">Available in English, Hindi, Marathi, and Tamil to ensure every patient is heard.</p>
               </div>
               <div className="space-y-4">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center font-black">02</div>
                  <h4 className="text-xl font-black text-slate-900">AI Triage Assistance</h4>
                  <p className="text-slate-500 leading-relaxed">Real-time symptom analysis helps route patients to the right specialist instantly.</p>
               </div>
               <div className="space-y-4">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center font-black">03</div>
                  <h4 className="text-xl font-black text-slate-900">Secure Records</h4>
                  <p className="text-slate-500 leading-relaxed">Integrated tracking of patient health status and doctor prescriptions in one hub.</p>
               </div>
            </section>
          </div>
        )}

        {view === 'patient-login' && <PatientLogin onLogin={handlePatientLogin} lang={lang} onBack={() => setView('landing')} />}
        {view === 'doctor-login' && <DoctorLogin onLogin={handleDoctorLogin} lang={lang} onBack={() => setView('landing')} />}
        {view === 'patient-dash' && <PatientDashboard patient={user} lang={lang} />}
        {view === 'doctor-dash' && <DoctorDashboard doctor={user} lang={lang} />}
      </main>

      <footer className={`py-16 text-center border-t transition-colors ${role === 'doctor' ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-100'}`}>
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex justify-center gap-3 items-center grayscale opacity-50">
            <div className="w-8 h-8 bg-blue-600 rounded-xl"></div>
            <span className={`font-black text-xl ${role === 'doctor' ? 'text-white' : 'text-slate-900'}`}>{APP_NAME}</span>
          </div>
          <p className="text-xs text-slate-500 font-medium">© 2024 {APP_NAME} Medical Solutions. Quality care through digital innovation.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
