export const readDataFromJSON = async () => {
  try {
    const response = await fetch("/assets/data.json");
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};
