export const getBuilderTitle = (role: string): string => {
  const cleanRole = role.toLowerCase();
  if (cleanRole.includes('ai') || cleanRole.includes('model') || cleanRole.includes('ml')) {
    return 'THE MODEL WHISPERER';
  }
  if (cleanRole.includes('frontend') || cleanRole.includes('css') || cleanRole.includes('react')) {
    return 'PIXEL PERFECT ARCHITECT';
  }
  if (cleanRole.includes('backend') || cleanRole.includes('node') || cleanRole.includes('database')) {
    return 'DATABASE CONJURER';
  }
  if (cleanRole.includes('fullstack') || cleanRole.includes('full stack')) {
    return 'UNSTOPPABLE GENERALIST';
  }
  return 'THE TROPICAL CODE CRAFTER';
};

export const SUGGESTED_TITLES = [
  'THE MODEL WHISPERER',
  'PIXEL PERFECT ARCHITECT',
  'DATABASE CONJURER',
  'UNSTOPPABLE GENERALIST',
  'THE TROPICAL CODE CRAFTER',
  'PRODUCTION SHIPPER',
  'COMPILER COMPANION',
  'LOGIC SORCERER'
];
