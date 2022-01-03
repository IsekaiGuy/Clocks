const getTimezones = async () => {
  try {
    const response = await fetch("./timezones.json");
    if (!response.ok)
      throw new Error(`Could not fetch timezones, status: ${response.status}`);

    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
};

export default getTimezones;
