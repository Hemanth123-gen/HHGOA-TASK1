export const generateDeterministicId = (name: string, role: string): string => {
  const cleanName = name.trim().toUpperCase();
  const cleanRole = role.trim().toUpperCase();
  const combine = `${cleanName}-${cleanRole}`;
  
  let hash = 0;
  for (let i = 0; i < combine.length; i++) {
    hash = (hash << 5) - hash + combine.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  
  const absHash = Math.abs(hash);
  const hex = absHash.toString(16).toUpperCase().substring(0, 4);
  
  // Pad if shorter than 4 chars
  const paddedHex = hex.padEnd(4, '7');
  return `HH26-${paddedHex}`;
};
