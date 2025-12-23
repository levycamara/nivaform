export const maskPhone = (value: string) => {
  if (!value) return "";
  
  // Remove non-digits
  value = value.replace(/\D/g, "");
  
  // Limit to 11 digits
  value = value.substring(0, 11);
  
  // Apply mask (XX) XXXXX-XXXX
  value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
  value = value.replace(/(\d)(\d{4})$/, "$1-$2");
  
  return value;
};

export const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPhone = (phone: string) => {
  // Check for (XX) XXXXX-XXXX or (XX) XXXX-XXXX format essentially by length of digits
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 11;
};