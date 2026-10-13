import { z } from 'zod';
import { database } from '@/lib/server-db';
import { loadAttachment, type EmailAttachment } from '@/lib/email-attachments';

export function gmailConfigured(){return ['GMAIL_CLIENT_ID','GMAIL_CLIENT_SECRET','GMAIL_REFRESH_TOKEN'].every(key=>!!process.env[key])&&z.string().email().safeParse(process.env.GMAIL_SENDER).success;}
const base64=(value:string)=>Buffer.from(value).toString('base64');
const wrap=(value:string)=>value.match(/.{1,76}/g)?.join('\r\n')||'';
const header=(value:string)=>`=?UTF-8?B?${base64(value.replace(/[\r\n]/g,' '))}?=`;
export async function registrationMail(id:string):Promise<'sent'|'not_configured'|'failed'> {
  if(!gmailConfigured())return 'not_configured';
  try {
    const person=await database().prepare('SELECT * FROM registrations WHERE id=?').bind(id).first<Record<string,string>>();
    if(!person)return 'failed';
    const event=await database().prepare('SELECT data FROM events WHERE id=?').bind(Number(person.event_id)).first<{data:string}>();
    const settings=await database().prepare("SELECT value FROM settings WHERE key='emails'").first<{value:string}>();
    const emails=settings?JSON.parse(settings.value):{},details=event?JSON.parse(event.data):{};
    const kind=person.status==='confirmed'?'success':'wait';
    const placeholders:Record<string,string>={vorname:person.first_name,nachname:person.last_name,veranstaltung:details.title||'',datum:details.dateLong||''};
    const render=(value:string)=>value.replace(/\{\{(vorname|nachname|veranstaltung|datum)\}\}/g,(_,key)=>placeholders[key]);
    const subject=render(emails[kind+'Subject']??(kind==='success'?'Anmeldung erfolgreich – {{veranstaltung}}':'Warteliste – {{veranstaltung}}'));
    const message=render(emails[kind]??(kind==='success'?'Hallo {{vorname}}, deine Anmeldung für {{veranstaltung}} wurde bestätigt.':'Hallo {{vorname}}, du stehst auf der Warteliste für {{veranstaltung}}.'));
    const boundary='julbach_'+crypto.randomUUID();
    const parts=[`From: ${process.env.GMAIL_SENDER}`,`To: ${person.email.replace(/[\r\n]/g,'')}`,`Subject: ${header(subject)}`,'MIME-Version: 1.0',`Content-Type: multipart/mixed; boundary="${boundary}"`,'',`--${boundary}`,'Content-Type: text/plain; charset=UTF-8','Content-Transfer-Encoding: base64','',wrap(base64(message))];
    for(const file of (emails[kind+'Attachments']||[]) as EmailAttachment[]){
      const stored=await loadAttachment(file.id);if(!stored)throw new Error('Missing attachment');
      parts.push(`--${boundary}`,'Content-Type: application/octet-stream',`Content-Disposition: attachment; filename*=UTF-8''${encodeURIComponent(stored.name)}`,'Content-Transfer-Encoding: base64','',wrap(stored.content));
    }
    parts.push(`--${boundary}--`,'');
    const tokenResponse=await fetch('https://oauth2.googleapis.com/token',{method:'POST',body:new URLSearchParams({client_id:process.env.GMAIL_CLIENT_ID!,client_secret:process.env.GMAIL_CLIENT_SECRET!,refresh_token:process.env.GMAIL_REFRESH_TOKEN!,grant_type:'refresh_token'}),signal:AbortSignal.timeout(15000)});
    if(!tokenResponse.ok)throw new Error('Gmail authorization failed');
    const token=await tokenResponse.json() as {access_token?:string};
    if(!token.access_token)throw new Error('Missing Gmail token');
    const response=await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send',{method:'POST',headers:{Authorization:`Bearer ${token.access_token}`,'Content-Type':'application/json'},body:JSON.stringify({raw:Buffer.from(parts.join('\r\n')).toString('base64url')}),signal:AbortSignal.timeout(15000)});
    if(!response.ok)throw new Error('Gmail send failed');
    return 'sent';
  }catch{console.error('Automatischer Gmail-Versand fehlgeschlagen.');return 'failed';}
}
