export const formatDate = (dateStr: string | Date) => {
  const d = new Date(dateStr);
  return d.toISOString().slice(0, 10);
};
