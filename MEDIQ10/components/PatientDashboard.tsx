
import React, { useState, useEffect } from 'react';
import { appointmentService } from '../services/appointmentService';
import { getMedicineInfo } from '../services/geminiService';
import { Appointment, Language, MedicineInfo } from '../types';
import { TRANSLATIONS } from '../constants';
import { PatientForm } from './PatientForm';
import { ChatRoom } from './ChatRoom';

interface PatientDashboardProps {
  patient: any;
  lang: Language;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ patient, lang }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  
  // AI Medicine State
  const [medQuery, setMedQuery] = useState('');
  const [medResult, setMedResult] = useState<MedicineInfo | null>(null);
  const [isSearchingMed, setIsSearchingMed] = useState(false);
  const [rxAiAnalysis, setRxAiAnalysis] = useState<Record<string, MedicineInfo>>({});
  const [isAnalyzingRx, setIsAnalyzingRx] = useState<Record<string, boolean>>({});

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const loadData = () => {
      const all = appointmentService.getAppointments();
      const mine = all.filter(a => a.patientPhone === patient.phone);
      setAppointments(mine);
    };
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [patient.phone, showForm]);

  const handleMedSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!medQuery.trim()) return;
    
    setIsSearchingMed(true);
    setMedResult(null);
    try {
      const info = await getMedicineInfo(medQuery);
      setMedResult(info);
    } catch (err) {
      alert("AI Assistant: " + err);
    } finally {
      setIsSearchingMed(false);
    }
  };

  const analyzePrescription = async (appointmentId: string, rxText: string) => {
    setIsAnalyzingRx(prev => ({ ...prev, [appointmentId]: true }));
    try {
      const info = await getMedicineInfo(rxText);
      setRxAiAnalysis(prev => ({ ...prev, [appointmentId]: info }));
    } catch (err) {
      alert("AI Analysis failed: " + err);
    } finally {
      setIsAnalyzingRx(prev => ({ ...prev, [appointmentId]: false }));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Welcome, {patient.name}</h2>
          <p className="text-slate-500 font-medium">Manage your health and medications in one place.</p>
        </div>
        <button 
          onClick={() => { setShowForm(!showForm); setActiveChatId(null); }}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all"
        >
          {showForm ? 'View My History' : t.bookAppt}
        </button>
      </div>

      {/* NEW: AI Pharmacy Assistant Section */}
      {!showForm && (
        <section className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[2.5rem] shadow-2xl text-white">
          <div className="max-w-3xl">
            <h3 className="text-2xl font-black mb-2 flex items-center gap-3">
              <span className="p-2 bg-white/20 rounded-xl">💊</span>
              AI Pharmacy Assistant
            </h3>
            <p className="text-blue-100 mb-6 font-medium">Type any medicine name to learn about its uses and safety instructions.</p>
            
            <form onSubmit={handleMedSearch} className="relative mb-6">
              <input 
                type="text" 
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:text-slate-900 transition-all placeholder:text-blue-200"
                placeholder="Search medicine (e.g. Paracetamol, Metformin)..."
                value={medQuery}
                onChange={(e) => setMedQuery(e.target.value)}
              />
              <button 
                type="submit"
                disabled={isSearchingMed}
                className="absolute right-2 top-2 bottom-2 bg-white text-blue-600 px-6 rounded-xl font-black hover:bg-blue-50 transition-all disabled:opacity-50"
              >
                {isSearchingMed ? 'Asking AI...' : 'Ask AI'}
              </button>
            </form>

            {medResult && (
              <div className="bg-white rounded-3xl p-6 text-slate-800 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex justify-between items-start mb-4">
                   <h4 className="text-xl font-black text-blue-600">{medResult.name}</h4>
                   <button onClick={() => setMedResult(null)} className="text-slate-300 hover:text-red-500">✕</button>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">General Info</label>
                    <p className="text-sm font-medium leading-relaxed">{medResult.whatIsIt}</p>
                    
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4 mb-2 block">Common Instructions</label>
                    <ul className="space-y-1">
                      {medResult.instructions.map((inst, i) => (
                        <li key={i} className="text-sm flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                          {inst}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <label className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2 block">Precautions</label>
                    <p className="text-xs font-bold text-slate-600 mb-4 italic leading-relaxed">{medResult.precautions}</p>
                    
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Potential Side Effects</label>
                    <div className="flex flex-wrap gap-2">
                      {medResult.sideEffects.map((se, i) => (
                        <span key={i} className="bg-white border border-slate-200 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-bold">
                          {se}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-[9px] text-slate-400 mt-6 text-center border-t pt-4 font-medium uppercase tracking-tighter italic">
                  Disclaimer: This information is AI-generated and for educational purposes only. Always consult your doctor.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {showForm ? (
        <PatientForm onComplete={() => setShowForm(false)} lang={lang} initialData={{name: patient.name, phone: patient.phone}} />
      ) : (
        <div className="grid gap-6">
          <h3 className="text-xl font-black text-slate-900 ml-2">My Appointments & Records</h3>
          {appointments.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
               <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
               </div>
               <p className="text-slate-400 font-bold">No history found. Book your first appointment today!</p>
            </div>
          ) : (
            appointments.map(app => (
              <div key={app.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col transition-all overflow-hidden">
                <div className="flex flex-col md:flex-row gap-8 items-start group">
                  <div className="md:w-1/4">
                    <div className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1.5">{app.appointmentDate}</div>
                    <div className="text-xl font-black text-slate-900 mb-1">{app.appointmentTime}</div>
                    <h4 className="font-bold text-slate-700">{app.doctorName}</h4>
                    <div className={`inline-block px-4 py-1 rounded-full text-[10px] font-black mt-3 uppercase tracking-tighter ${
                      app.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {app.status}
                    </div>
                  </div>
                  <div className="flex-1 space-y-5">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t.problem}</span>
                      <p className="text-slate-600 font-medium leading-relaxed">{app.patientProblem}</p>
                    </div>
                    {app.doctorNotes && (
                      <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                           <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
                        </div>
                        <div className="flex justify-between items-start mb-4 relative z-10">
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                            Doctor's Feedback & Prescription
                          </span>
                          
                          {/* AI Prescription Help Trigger */}
                          {!rxAiAnalysis[app.id] && (
                            <button 
                              onClick={() => analyzePrescription(app.id, app.doctorNotes!)}
                              disabled={isAnalyzingRx[app.id]}
                              className="text-[10px] font-black bg-white border border-blue-200 text-blue-600 px-3 py-1.5 rounded-full shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
                            >
                              <span className={isAnalyzingRx[app.id] ? "animate-pulse" : ""}>🧠</span>
                              {isAnalyzingRx[app.id] ? "AI Analyzing Rx..." : "Understand with AI"}
                            </button>
                          )}
                        </div>
                        
                        <p className="text-slate-800 font-bold whitespace-pre-wrap leading-relaxed relative z-10">{app.doctorNotes}</p>

                        {/* AI Analysis Result for specific Prescription */}
                        {rxAiAnalysis[app.id] && (
                          <div className="mt-6 pt-6 border-t border-blue-200/50 animate-in slide-in-from-bottom-4 duration-500 relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="bg-blue-600 text-white p-1 rounded-md text-[10px] font-black">AI Insight</span>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Simplified Explanation</p>
                            </div>
                            <div className="bg-white/60 p-4 rounded-2xl border border-white">
                              <h5 className="text-sm font-black text-slate-900 mb-1">{rxAiAnalysis[app.id].name}</h5>
                              <p className="text-xs text-slate-600 mb-3">{rxAiAnalysis[app.id].whatIsIt}</p>
                              
                              <div className="flex gap-4">
                                <div className="flex-1">
                                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">How to take</label>
                                  <ul className="text-[10px] text-slate-700 font-bold list-disc ml-3">
                                    {rxAiAnalysis[app.id].instructions.slice(0, 2).map((ins, i) => <li key={i}>{ins}</li>)}
                                  </ul>
                                </div>
                                <div className="flex-1">
                                  <label className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-1 block">Caution</label>
                                  <p className="text-[10px] text-red-600 font-bold leading-tight">{rxAiAnalysis[app.id].precautions.split('.')[0]}.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="md:w-1/5 text-right flex flex-col items-end gap-3">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t.healthStatus}</span>
                      <div className={`px-5 py-2.5 rounded-2xl text-xs font-black shadow-lg shadow-current/10 ${
                        app.healthStatus === 'Critical' ? 'bg-red-500 text-white' :
                        app.healthStatus === 'Serious' ? 'bg-orange-500 text-white' :
                        app.healthStatus === 'Fair' ? 'bg-blue-500 text-white' :
                        'bg-green-500 text-white'
                      }`}>
                        {app.healthStatus}
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveChatId(activeChatId === app.id ? null : app.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                        activeChatId === app.id 
                          ? 'bg-slate-900 text-white' 
                          : 'bg-white border-2 border-slate-100 text-slate-600 hover:border-blue-500 hover:text-blue-600'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                      {activeChatId === app.id ? 'Close Chat' : 'Chat with Doctor'}
                    </button>
                  </div>
                </div>

                {activeChatId === app.id && (
                  <div className="mt-8 pt-8 border-t border-slate-100 animate-in slide-in-from-top-4 duration-300">
                    <ChatRoom appointmentId={app.id} currentRole="patient" theme="light" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
