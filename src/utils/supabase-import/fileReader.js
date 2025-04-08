/**
 * Utility for reading CSV files for Supabase import
 */

/**
 * Read a file as text
 * @param {File} file - The file to read
 * @returns {Promise<string>} - The file contents as text
 */
export const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

/**
 * Read multiple files and return their contents
 * @param {Object} files - Object with file references
 * @returns {Promise<Object>} - Object with file contents
 */
export const readMultipleFiles = async (files) => {
  const result = {};
  
  for (const [key, file] of Object.entries(files)) {
    if (file) {
      try {
        result[key] = await readFileAsText(file);
      } catch (error) {
        console.error(`Error reading ${key} file:`, error);
        result[key] = null;
      }
    }
  }
  
  return result;
};

export default {
  readFileAsText,
  readMultipleFiles
};
