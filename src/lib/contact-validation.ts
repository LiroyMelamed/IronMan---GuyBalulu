export function validateContact(name: string, phone: string): { field: 'name' | 'phone'; message: string } | null {
  if (name.trim().length < 2) return { field: 'name', message: 'נא להזין שם מלא.' };
  const normalized = phone.replace(/[\s()-]/g, '');
  if (!/^\+?[0-9]{9,15}$/.test(normalized)) return { field: 'phone', message: 'נא להזין מספר טלפון תקין.' };
  return null;
}
