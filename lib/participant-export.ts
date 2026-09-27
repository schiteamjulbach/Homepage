type Person = {last_name:string;first_name:string;birth_date:string;address:string;postal_code:string;city:string;skill:string;osv_member:number|null;phone:string;admin_note:string};
export function participantColumns(levels:string[],people:Person[]):[string,string][]{
  const skills=[...new Set([...levels,...people.map(p=>p.skill)])];
  return [['number','Nr.'],['name','Nachname Vorname'],['birth_date','Geburtsdatum'],['address','Adresse'],...skills.map(level=>['skill:'+level,level] as [string,string]),['osv_member','ÖSV-Mitglied'],['phone','Telefonnummer'],['admin_note','Bemerkung für den Admin']];
}
export function participantRows(columns:[string,string][],people:Person[]):unknown[][]{
  return [columns.map(c=>c[1]),...people.map((p,index)=>columns.map(([key])=>{
    if(key==='number')return index+1;
    if(key==='name')return [p.last_name,p.first_name].filter(Boolean).join(' ');
    if(key==='birth_date')return p.birth_date?p.birth_date.split('-').reverse().join('.'):'';
    if(key==='address')return [p.address,[p.postal_code,p.city].filter(Boolean).join(' ')].filter(Boolean).join(', ');
    if(key.startsWith('skill:'))return p.skill===key.slice(6)?'X':'';
    if(key==='osv_member')return p.osv_member==null?'':p.osv_member?'Ja':'Nein';
    if(key==='phone')return p.phone;
    if(key==='admin_note')return p.admin_note||'';
    return '';
  }))];
}
