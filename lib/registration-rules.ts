export type RegistrationWindow = { active: boolean; starts: string; ends: string };
export function registrationWindow(event: RegistrationWindow, now = Date.now()) {
  const scheduled = Boolean(event.starts && event.ends);
  const before = Boolean(event.starts) && now < Date.parse(event.starts);
  const ended = Boolean(event.ends) && now >= Date.parse(event.ends);
  const active = (scheduled || event.active) && !before && !ended;
  return { scheduled, active, before, ended };
}
export function isLocalAddress(postalCode: string, city: string) {
  return postalCode.trim() === '4162' && city.normalize('NFKC').trim().toLocaleLowerCase('de-AT') === 'julbach';
}
