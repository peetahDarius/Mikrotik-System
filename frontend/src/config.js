const config = {};

export const loadConfig = async () => {
  try {
    const response = await fetch("/config.json");
    if (!response.ok) {
      throw new Error(`Failed to load config.json: ${response.statusText}`);
    }
    const data = await response.json();
    console.log("The data is: ", data);
    Object.assign(config, data); // Populate the config object
  } catch (error) {
    console.error("Error loading configuration:", error);
    throw error; // Re-throw error to handle in `index.js`
  }
};

export const getConfig = (key) => config[key];
