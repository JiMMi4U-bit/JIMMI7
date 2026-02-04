
import React, { useState } from 'react';
import { DOCTORS, TRANSLATIONS, TIME_SLOTS } from '../constants';
import { appointmentService } from '../services/appointmentService';
import { performTriage } from '../services/geminiService';
import { TriageResponse, Language } from '../types';

interface PatientFormProps {
  onComplete?: () => void;
  lang: Language;
  initialData?: { name: string; phone: string };
}

export const PatientForm: React.FC<PatientFormProps> = ({ onComplete, lang, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    problem: '',
    doctorId: '',
    date: '',
    time: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [triage, setTriage] = useState<TriageResponse | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const t = TRANSLATIONS[lang];

  const handleTriage = async () => {
    if (!formData.problem || formData.problem.length < 10) return;
    setAnalyzing(true);
    try {
      const result = await performTriage(formData.problem);
      setTriage(result);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const selectedDoctor = DOCTORS.find(d => d.id === formData.doctorId);
    
    appointmentService.saveAppointment({
      patientName: formData.name,
      patientPhone: formData.phone,
      patientProblem: formData.problem,
      doctorId: formData.doctorId,
      doctorName: selectedDoctor?.name || 'Unknown Doctor',
      appointmentDate: formData.date,
      appointmentTime: formData.time
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
    }, 1000);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto text-center p-8 bg-white rounded-3xl shadow-xl">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Success!</h2>
        <p className="text-slate-600 mb-6">Your appointment request has been sent.</p>
        <button 
          onClick={() => {
            setSuccess(false);
            if (onComplete) onComplete();
          }}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">{t.bookAppt}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t.name}</label>
            <input
              required
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="John Doe"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t.phone}</label>
            <input
              required
              type="tel"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="+91 00000 00000"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t.problem}</label>
            <div className="relative">
              <textarea
                required
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Briefly explain what's bothering you..."
                value={formData.problem}
                onChange={e => setFormData({ ...formData, problem: e.target.value })}
                onBlur={handleTriage}
              />
              {analyzing && (
                <div className="absolute right-3 bottom-3 flex items-center gap-2 text-xs text-blue-600 animate-pulse">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  AI Analyzing...
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.selectDoc}</label>
              <select
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.doctorId}
                onChange={e => setFormData({ ...formData, doctorId: e.target.value })}
              >
                <option value="">Choose...</option>
                {DOCTORS.map(doc => (
                  <option key={doc.id} value={doc.id}>{doc.name} ({doc.specialization})</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.prefDate}</label>
                <input
                  required
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.prefTime}</label>
                <select
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.time}
                  onChange={e => setFormData({ ...formData, time: e.target.value })}
                >
                  <option value="">Pick slot...</option>
                  {TIME_SLOTS.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 disabled:bg-slate-300 transition-all flex justify-center items-center gap-2 shadow-lg shadow-blue-200 mt-4"
          >
            {isSubmitting ? 'Booking...' : t.confirm}
          </button>
        </form>
      </div>

      <div className="space-y-6">
        {triage && (
          <div className="bg-white p-6 rounded-3xl shadow-lg border-t-4 border-blue-500 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-slate-800">Smart AI Analysis</h3>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                triage.urgency === 'High' ? 'bg-red-100 text-red-600' : 
                triage.urgency === 'Medium' ? 'bg-orange-100 text-orange-600' : 
                'bg-green-100 text-green-600'
              }`}>
                {triage.urgency} Priority
              </span>
            </div>
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
              Based on your description, we recommend a <strong>{triage.recommendedSpecialization}</strong>.
            </p>
            <div className="bg-slate-50 p-4 rounded-2xl mb-4 italic text-sm text-slate-500 border-l-4 border-blue-400">
              "{triage.explanation}"
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Preparation Checkpoints:</p>
              <ul className="space-y-2">
                {triage.possibleQuestions.map((q, idx) => (
                  <li key={idx} className="text-sm text-slate-700 flex items-start gap-3 bg-slate-50 p-2 rounded-xl">
                    <span className="w-5 h-5 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0 shadow-sm">{idx + 1}</span>
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
