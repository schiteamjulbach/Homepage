import { database } from '@/lib/server-db';
import { z } from 'zod';

export const attachmentSchema = z.object({id:z.string().uuid(),name:z.string().min(1).max(200),size:z.number().int().positive().max(4000000)});
export type EmailAttachment = z.infer<typeof attachmentSchema>;
export const attachmentListSchema = z.array(attachmentSchema).max(5).default([]).refine(files=>files.reduce((sum,file)=>sum+file.size,0)<=10000000,'Anhänge insgesamt maximal 10 MB.');
export async function loadAttachment(id:string) {
  const row=await database().prepare('SELECT value FROM settings WHERE key=?').bind('email_attachment_'+id).first<{value:string}>();
  return row?JSON.parse(row.value) as EmailAttachment & {content:string}:null;
}
export async function validateAttachments(files:EmailAttachment[]) {
  for(const file of files){const stored=await loadAttachment(file.id);if(!stored||stored.name!==file.name||stored.size!==file.size)throw new Error('Anhang nicht gefunden.');}
}
