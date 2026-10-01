import { defaultEventDescription, defaultEventInfo } from '@/lib/event-defaults';

export const initialEvents = [
  { id:1,title:"Kinderskikurs – Gruppe 1",date:"27.–29. DEZ",dateLong:"27.–29. Dezember 2026",eventDateMode:"range",eventStartDate:"2026-12-27",eventEndDate:"2026-12-29",place:"Hochficht",status:"Anmeldung offen",spots:12,imagePosition:"50% 16%",description:defaultEventDescription,info:[...defaultEventInfo],registrationInfo:"Bitte wähle die Könnensstufe passend zum aktuellen Fahrkönnen. Die Einteilung in die endgültigen Gruppen erfolgt durch unser Trainerteam vor Ort.",skillLevels:["Anfänger – erste Erfahrungen auf Ski","Leicht fortgeschritten – selbstständiges Bremsen und Kurvenfahren","Fortgeschritten – sicheres Fahren auf roten Pisten"] },
];
