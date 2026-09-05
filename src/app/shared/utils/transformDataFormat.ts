export const transformDataFormat = (dateIso: string) => {
  const date = new Date(dateIso);

  return `${String(date.getDate()).padStart(2, '0')}/${String(
    date.getMonth() + 1
  ).padStart(2, '0')}/${date.getFullYear()}`;
};
