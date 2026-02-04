
import React, { useState, useEffect } from 'react';
import { appointmentService } from '../services/appointmentService';
import { Appointment, AppointmentStatus, HealthStatus, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { ChatRoom } from './ChatRoom';

interface DoctorDashboardProps {
  doctor: any;
  lang: Language;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ doctor, lang }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [noteText, setNoteText] = useState('');
  const [hStatus, setHStatus] = useState<HealthStatus>('Fair');
  const [showChat, setShowChat] = useState(false);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const all = appointmentService.getAppointments();
    // Filter to show only appointments for this doctor
    const myAppointments = all.filter(app => app.doctorId === doctor.id);
    setAppointments(myAppointments);
  }, [doctor.id]);

  const handleUpdate = () => {
    if (!selectedAppt) return;
    appointmentService.updateHealthAndNotes(selectedAppt.id, hStatus, noteText);
    const updatedAll = appointmentService.getAppointments();
    setAppointments(updatedAll.filter(app => app.doctorId === doctor.id));
    alert("Profile updated successfully!");
  };

  const openPatientDetail = (appt: Appointment) => {
    setSelectedAppt(appt);
    setNoteText(appt.doctorNotes || '');
    setHStatus(appt.healthStatus || 'Fair');
    setShowChat(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-100">Hello, {doctor.name}</h2>
        <p className="text-sm text-slate-400">{t.adminPanel}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl shadow-sm border border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-800 bg-slate-900/50">
            <h3 className="font-bold text-slate-100">Recent Appointments</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-800/50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Symptoms</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Condition</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">No appointments assigned to you.</td>
                  </tr>
                ) : appointments.map(app => (
                  <tr key={app.id} className={`hover:bg-white/5 transition-colors cursor-pointer ${selectedAppt?.id === app.id ? 'bg-white/5' : ''}`} onClick={() => openPatientDetail(app)}>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-100">{app.patientName}</div>
                      <div className="text-[10px] text-slate-500">{app.patientPhone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-400 max-w-[150px] truncate" title={app.patientProblem}>
                        {app.patientProblem}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-300 font-medium">{app.appointmentDate}</div>
                      <div className="text-xs text-blue-400 font-bold">{app.appointmentTime}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        app.healthStatus === 'Critical' ? 'bg-red-900/50 text-red-400' :
                        app.healthStatus === 'Serious' ? 'bg-orange-900/50 text-orange-400' :
                        app.healthStatus === 'Fair' ? 'bg-blue-900/50 text-blue-400' :
                        'bg-green-900/50 text-green-400'
                      }`}>{app.healthStatus}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-blue-400 text-sm font-bold hover:underline">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          {selectedAppt ? (
            <div className="bg-slate-900 p-6 rounded-3xl shadow-xl border border-blue-900/50 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-100">{selectedAppt.patientName}</h3>
                <div className="flex bg-slate-800 p-1 rounded-xl">
                  <button 
                    onClick={() => setShowChat(false)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${!showChat ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
                  >
                    Status
                  </button>
                  <button 
                    onClick={() => setShowChat(true)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${showChat ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
                  >
                    Chat
                  </button>
                </div>
              </div>
              
              {!showChat ? (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* NEW: Patient's Reported Problem display */}
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                    <label className="block text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">{t.problem}</label>
                    <p className="text-slate-100 text-sm leading-relaxed italic">
                      "{selectedAppt.patientProblem}"
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">{t.healthStatus}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Good', 'Fair', 'Serious', 'Critical'].map(status => (
                        <button
                          key={status}
                          onClick={() => setHStatus(status as HealthStatus)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                            hStatus === status 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">{t.notes}</label>
                    <textarea
                      rows={6}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-100 transition-all placeholder:text-slate-600"
                      placeholder="Enter diagnosis, prescription, or feedback..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                    />
                  </div>

                  <button 
                    onClick={handleUpdate}
                    className="w-full bg-blue-600 text-white py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                  >
                    {t.save}
                  </button>
                  
                  <button 
                    onClick={() => setSelectedAppt(null)}
                    className="w-full text-slate-500 py-1 text-xs hover:text-slate-400 font-bold uppercase tracking-widest"
                  >
                    Close Sidebar
                  </button>
                </div>
              ) : (
                <div className="animate-in slide-in-from-right-4 duration-300">
                  <ChatRoom appointmentId={selectedAppt.id} currentRole="doctor" theme="dark" />
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-3xl p-12 text-center text-slate-600">
              <svg className="w-12 h-12 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <p className="text-xs font-bold uppercase tracking-widest">Select a patient to manage care</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
