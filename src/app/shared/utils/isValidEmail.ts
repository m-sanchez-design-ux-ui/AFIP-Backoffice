export const isValidEmail = (email: string): boolean => {
  const match = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).exec(
    String(email).toLowerCase()
  );

  return !!match;
};
