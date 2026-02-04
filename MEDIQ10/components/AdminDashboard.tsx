
import React, { useState, useEffect } from 'react';
import { appointmentService } from '../services/appointmentService';
import { Appointment, AppointmentStatus } from '../types';

export const AdminDashboard: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    setAppointments(appointmentService.getAppointments());
  }, []);

  const handleStatusUpdate = (id: string, status: AppointmentStatus) => {
    appointmentService.updateStatus(id, status);
    setAppointments(appointmentService.getAppointments());
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this appointment?')) {
      appointmentService.deleteAppointment(id);
      setAppointments(appointmentService.getAppointments());
    }
  };

  const filtered = appointments.filter(app => 
    filterStatus === 'ALL' ? true : app.status === filterStatus
  ).sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === AppointmentStatus.PENDING).length,
    confirmed: appointments.filter(a => a.status === AppointmentStatus.CONFIRMED).length
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">Total Appointments</p>
          <h4 className="text-3xl font-bold text-slate-800">{stats.total}</h4>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-blue-500 text-sm font-medium">Pending Review</p>
          <h4 className="text-3xl font-bold text-slate-800">{stats.pending}</h4>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-green-500 text-sm font-medium">Confirmed Today</p>
          <h4 className="text-3xl font-bold text-slate-800">{stats.confirmed}</h4>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-slate-800">Appointments Management</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Filter:</span>
            <select 
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-sm outline-none"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value={AppointmentStatus.PENDING}>Pending</option>
              <option value={AppointmentStatus.CONFIRMED}>Confirmed</option>
              <option value={AppointmentStatus.CANCELLED}>Cancelled</option>
              <option value={AppointmentStatus.COMPLETED}>Completed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Patient Info</th>
                <th className="px-6 py-4">Doctor</th>
                <th className="px-6 py-4">Issue</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">No appointments found matching your criteria.</td>
                </tr>
              ) : filtered.map(app => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">{app.patientName}</div>
                    <div className="text-xs text-slate-500">{app.patientPhone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-800 font-medium">{app.doctorName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600 line-clamp-1 max-w-xs" title={app.patientProblem}>
                      {app.patientProblem}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-800">{new Date(app.appointmentDate).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-[10px] font-bold rounded-full uppercase tracking-tighter ${
                      app.status === AppointmentStatus.PENDING ? 'bg-blue-100 text-blue-600' :
                      app.status === AppointmentStatus.CONFIRMED ? 'bg-green-100 text-green-600' :
                      app.status === AppointmentStatus.CANCELLED ? 'bg-red-100 text-red-600' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                    <button 
                      onClick={() => handleStatusUpdate(app.id, AppointmentStatus.CONFIRMED)}
                      className="text-green-600 hover:bg-green-50 p-1.5 rounded-lg transition-colors" title="Confirm"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(app.id, AppointmentStatus.CANCELLED)}
                      className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors" title="Cancel"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <button 
                      onClick={() => handleDelete(app.id)}
                      className="text-slate-400 hover:bg-slate-100 p-1.5 rounded-lg transition-colors" title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
