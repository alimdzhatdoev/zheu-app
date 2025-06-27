export const loadData = async () => {
  const res = await fetch('/data.json');
  const data = await res.json();
  return data;
};
