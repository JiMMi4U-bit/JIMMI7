
export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export type HealthStatus = 'Good' | 'Fair' | 'Serious' | 'Critical';

export interface ChatMessage {
  id: string;
  senderRole: 'patient' | 'doctor';
  text: string;
  timestamp: string;
  isPrescription?: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  availability: string;
  rating: number;
  image: string;
  username: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  patientProblem: string;
  doctorId: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  status: AppointmentStatus;
  createdAt: string;
  healthStatus?: HealthStatus;
  doctorNotes?: string;
  chatHistory?: ChatMessage[];
}

export interface TriageResponse {
  recommendedSpecialization: string;
  urgency: 'Low' | 'Medium' | 'High';
  explanation: string;
  possibleQuestions: string[];
}

export interface MedicineInfo {
  name: string;
  whatIsIt: string;
  instructions: string[];
  sideEffects: string[];
  precautions: string;
}

export type Language = 'en' | 'hi' | 'mr' | 'ta';
