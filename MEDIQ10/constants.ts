
import { Doctor } from './types';

export const APP_NAME = "MediQ";

export const generateTimeSlots = () => {
  const slots = [];
  let current = new Date();
  current.setHours(10, 0, 0, 0); // Start at 10:00 AM
  const end = new Date();
  end.setHours(22, 0, 0, 0); // End at 10:00 PM

  while (current < end) {
    const startStr = current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    current.setMinutes(current.getMinutes() + 30);
    const endStr = current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    slots.push(`${startStr} - ${endStr}`);
  }
  return slots;
};

export const TIME_SLOTS = generateTimeSlots();

export const DOCTORS: Doctor[] = [
  {
    id: 'doc1',
    name: 'Dr. Sarah Mitchell',
    specialization: 'Cardiologist',
    experience: 12,
    availability: 'Mon - Fri, 9 AM - 5 PM',
    rating: 4.9,
    image: 'https://picsum.photos/seed/sarah/200/200',
    username: 'sarah'
  },
  {
    id: 'doc2',
    name: 'Dr. James Wilson',
    specialization: 'Neurologist',
    experience: 15,
    availability: 'Mon - Thu, 10 AM - 4 PM',
    rating: 4.8,
    image: 'https://picsum.photos/seed/james/200/200',
    username: 'james'
  },
  {
    id: 'doc3',
    name: 'Dr. Elena Rodriguez',
    specialization: 'Pediatrician',
    experience: 8,
    availability: 'Tue - Sat, 8 AM - 3 PM',
    rating: 4.7,
    image: 'https://picsum.photos/seed/elena/200/200',
    username: 'elena'
  }
];

export const TRANSLATIONS = {
  en: {
    welcome: "Welcome to MediQ",
    tagline: "Quality Healthcare, Powered by Intelligence.",
    bookAppt: "Book Appointment",
    mgmtPortal: "Doctor Portal",
    patientLogin: "Patient Login",
    doctorLogin: "Doctor Login",
    name: "Full Name",
    phone: "Phone Number",
    problem: "Symptoms",
    selectDoc: "Select Doctor",
    prefDate: "Preferred Date",
    prefTime: "Select Time Slot",
    confirm: "Confirm Appointment",
    adminPanel: "Doctor Dashboard",
    patientHistory: "Patient History",
    healthStatus: "Health Status",
    notes: "Doctor's Notes / Prescription",
    save: "Save Update",
    language: "Language"
  },
  hi: {
    welcome: "MediQ में आपका स्वागत है",
    tagline: "गुणवत्तापूर्ण स्वास्थ्य सेवा, बुद्धिमत्ता द्वारा संचालित।",
    bookAppt: "अपॉइंटमेंट बुक करें",
    mgmtPortal: "डॉक्टर पोर्टल",
    patientLogin: "मरीज लॉगिन",
    doctorLogin: "डॉक्टर लॉगिन",
    name: "पूरा नाम",
    phone: "फ़ोन नंबर",
    problem: "लक्षण",
    selectDoc: "डॉक्टर चुनें",
    prefDate: "पसंदीदा तारीख",
    prefTime: "समय स्लॉट चुनें",
    confirm: "अपॉइंटमेंट की पुष्टि करें",
    adminPanel: "डॉक्टर डैशबोर्ड",
    patientHistory: "मरीज का इतिहास",
    healthStatus: "स्वास्थ्य की स्थिति",
    notes: "डॉक्टर के नोट्स / पर्चे",
    save: "अपडेट सहेजें",
    language: "भाषा"
  },
  mr: {
    welcome: "MediQ मध्ये आपले स्वागत आहे",
    tagline: "गुणवत्तापूर्ण आरोग्य सेवा, बुद्धिमत्ता द्वारे संचालित.",
    bookAppt: "अपॉइंटमेंट बुक करा",
    mgmtPortal: "डॉक्टर पोर्टल",
    patientLogin: "रुग्ण लॉगिन",
    doctorLogin: "डॉक्टर लॉगिन",
    name: "पूर्ण नाव",
    phone: "फोन नंबर",
    problem: "लक्षणे",
    selectDoc: "डॉक्टर निवडा",
    prefDate: "पसंतीची तारीख",
    prefTime: "वेळ स्लॉट निवडा",
    confirm: "अपॉइंटमेंट निश्चित करा",
    adminPanel: "डॉक्टर डॅशबोर्ड",
    patientHistory: "रुग्णाचा इतिहास",
    healthStatus: "आरोग्य स्थिती",
    notes: "डॉक्टरांचे नोट्स / प्रिस्क्रिप्शन",
    save: "अपडेट जतन करा",
    language: "भाषा"
  },
  ta: {
    welcome: "MediQ-க்கு வரவேற்கிறோம்",
    tagline: "தரமான ஆரோக்கியம், நுண்ணறிவால் இயக்கப்படுகிறது.",
    bookAppt: "முன்பதிவு செய்யுங்கள்",
    mgmtPortal: "மருத்துவர் போர்டல்",
    patientLogin: "நோயாளி உள்நுழைவு",
    doctorLogin: "மருத்துவர் உள்நுழைவு",
    name: "முழு பெயர்",
    phone: "தொலைபேசி எண்",
    problem: "அறிகுறிகள்",
    selectDoc: "மருத்துவர் தேர்வு",
    prefDate: "விருப்பமான தேதி",
    prefTime: "நேரத்தைத் தேர்ந்தெடுக்கவும்",
    confirm: "முன்பதிவை உறுதி செய்",
    adminPanel: "மருத்துவர் டாஷ்போர்டு",
    patientHistory: "நோயாளி வரலாறு",
    healthStatus: "சுகாதார நிலை",
    notes: "மருத்துவர் குறிப்புகள் / மருந்துச்சீட்டு",
    save: "புதுப்பிப்பைச் சேமி",
    language: "மொழி"
  }
};
