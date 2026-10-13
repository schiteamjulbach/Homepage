'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { EmailAttachment } from '@/lib/email-attachments';

export function EmailAttachments({files,onChange,onBusy,disabled}:{files:EmailAttachment[];onChange:(files:EmailAttachment[])=>void;onBusy:(busy:boolean)=>void;disabled:boolean}) {
  const [uploading,setUploading]=useState(false),[error,setError]=useState('');
  async function upload(file?:File){
    if(!file)return;
    setError('');
    if(!file.size||file.size>4000000||files.length>=5||files.reduce((sum,item)=>sum+item.size,0)+file.size>10000000){setError('Maximal 5 Anhänge, je 4 MB und insgesamt 10 MB.');return;}
    setUploading(true);onBusy(true);
    try{const form=new FormData();form.append('attachment',file);const response=await fetch('/api/platform',{method:'POST',body:form});const data=await response.json() as {error?:string;attachment:EmailAttachment};if(!response.ok)throw new Error(data.error||'Upload fehlgeschlagen.');onChange([...files,data.attachment]);}catch(error){setError((error as Error).message);}finally{setUploading(false);onBusy(false);}
  }
  return <div className="email-attachments"><strong>Anhänge</strong><small>Diese Dateien werden bei jeder Mail dieser Vorlage automatisch mitgeschickt. Die Vorlagen gelten für alle Veranstaltungen.</small><ul>{files.map(file=><li key={file.id}><a href={'/api/platform?attachment='+file.id}>{file.name}</a><small>{(file.size/1000000).toLocaleString('de-AT',{maximumFractionDigits:2})} MB</small><Button type="button" variant="outline" disabled={disabled||uploading} onClick={()=>onChange(files.filter(item=>item.id!==file.id))} aria-label={`${file.name} entfernen`}>Entfernen</Button></li>)}</ul><label>Anhang hinzufügen<input type="file" disabled={disabled||uploading||files.length>=5} onChange={event=>{void upload(event.target.files?.[0]);event.target.value='';}}/></label><small>{uploading?'Wird hochgeladen …':'Maximal 5 Dateien, je 4 MB und insgesamt 10 MB. Danach „Vorlagen speichern“ klicken.'}</small>{error&&<p role="alert">{error}</p>}</div>;
}
