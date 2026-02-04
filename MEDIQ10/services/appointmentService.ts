
import { Appointment, AppointmentStatus, HealthStatus, ChatMessage } from '../types';

const STORAGE_KEY = 'medsync_appointments';

export const appointmentService = {
  getAppointments: (): Appointment[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>): Appointment => {
    const appointments = appointmentService.getAppointments();
    const newAppointment: Appointment = {
      ...appointment,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: AppointmentStatus.PENDING,
      healthStatus: 'Fair',
      chatHistory: []
    };
    
    appointments.push(newAppointment);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
    return newAppointment;
  },

  updateAppointment: (id: string, updates: Partial<Appointment>): void => {
    const appointments = appointmentService.getAppointments();
    const updated = appointments.map(app => 
      app.id === id ? { ...app, ...updates } : app
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  updateStatus: (id: string, status: AppointmentStatus): void => {
    appointmentService.updateAppointment(id, { status });
  },

  updateHealthAndNotes: (id: string, healthStatus: HealthStatus, notes: string): void => {
    appointmentService.updateAppointment(id, { healthStatus, doctorNotes: notes });
  },

  addChatMessage: (appointmentId: string, role: 'patient' | 'doctor', text: string, isPrescription: boolean = false): void => {
    const appointments = appointmentService.getAppointments();
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      senderRole: role,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isPrescription
    };

    const updated = appointments.map(app => {
      if (app.id === appointmentId) {
        // If it's a prescription, we also update the main doctorNotes field for the dashboard
        return {
          ...app,
          doctorNotes: isPrescription ? text : app.doctorNotes,
          chatHistory: [...(app.chatHistory || []), newMessage]
        };
      }
      return app;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  deleteAppointment: (id: string): void => {
    const appointments = appointmentService.getAppointments();
    const filtered = appointments.filter(app => app.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
};
