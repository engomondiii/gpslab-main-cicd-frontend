/* ============================================
   GPS LAB - Array Helper
   Array manipulation utilities
   ============================================ */

/**
 * Remove duplicates from array
 * @param {Array} arr - Array with duplicates
 * @returns {Array} Array without duplicates
 */
export const removeDuplicates = (arr) => {
  if (!Array.isArray(arr)) return [];
  return [...new Set(arr)];
};

/**
 * Remove duplicates by property
 * @param {Array} arr - Array of objects
 * @param {string} key - Property key
 * @returns {Array} Array without duplicates
 */
export const removeDuplicatesByKey = (arr, key) => {
  if (!Array.isArray(arr)) return [];
  const seen = new Set();
  return arr.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * Chunk array into smaller arrays
 * @param {Array} arr - Array to chunk
 * @param {number} size - Chunk size
 * @returns {Array} Array of chunks
 */
export const chunk = (arr, size) => {
  if (!Array.isArray(arr) || size <= 0) return [];
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

/**
 * Flatten nested array
 * @param {Array} arr - Nested array
 * @param {number} depth - Depth to flatten (default: Infinity)
 * @returns {Array} Flattened array
 */
export const flatten = (arr, depth = Infinity) => {
  if (!Array.isArray(arr)) return [];
  return arr.flat(depth);
};

/**
 * Shuffle array randomly
 * @param {Array} arr - Array to shuffle
 * @returns {Array} Shuffled array
 */
export const shuffle = (arr) => {
  if (!Array.isArray(arr)) return [];
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Get random element from array
 * @param {Array} arr - Array to pick from
 * @returns {*} Random element
 */
export const randomElement = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * Get random elements from array
 * @param {Array} arr - Array to pick from
 * @param {number} count - Number of elements to pick
 * @returns {Array} Random elements
 */
export const randomElements = (arr, count) => {
  if (!Array.isArray(arr) || count <= 0) return [];
  const shuffled = shuffle(arr);
  return shuffled.slice(0, Math.min(count, arr.length));
};

/**
 * Sort array by property
 * @param {Array} arr - Array to sort
 * @param {string} key - Property key
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} Sorted array
 */
export const sortBy = (arr, key, order = 'asc') => {
  if (!Array.isArray(arr)) return [];
  const sorted = [...arr].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
  return sorted;
};

/**
 * Group array by property
 * @param {Array} arr - Array to group
 * @param {string} key - Property key
 * @returns {Object} Grouped object
 */
export const groupBy = (arr, key) => {
  if (!Array.isArray(arr)) return {};
  return arr.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Filter array by multiple conditions
 * @param {Array} arr - Array to filter
 * @param {Object} conditions - Conditions object
 * @returns {Array} Filtered array
 */
export const filterBy = (arr, conditions) => {
  if (!Array.isArray(arr)) return [];
  return arr.filter(item => {
    return Object.keys(conditions).every(key => {
      return item[key] === conditions[key];
    });
  });
};

/**
 * Find element by property
 * @param {Array} arr - Array to search
 * @param {string} key - Property key
 * @param {*} value - Value to match
 * @returns {*} Found element or null
 */
export const findBy = (arr, key, value) => {
  if (!Array.isArray(arr)) return null;
  return arr.find(item => item[key] === value) || null;
};

/**
 * Check if array contains value
 * @param {Array} arr - Array to check
 * @param {*} value - Value to look for
 * @returns {boolean} True if contains
 */
export const contains = (arr, value) => {
  if (!Array.isArray(arr)) return false;
  return arr.includes(value);
};

/**
 * Get intersection of arrays
 * @param {Array} arr1 - First array
 * @param {Array} arr2 - Second array
 * @returns {Array} Intersection
 */
export const intersection = (arr1, arr2) => {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) return [];
  return arr1.filter(value => arr2.includes(value));
};

/**
 * Get union of arrays
 * @param {Array} arr1 - First array
 * @param {Array} arr2 - Second array
 * @returns {Array} Union
 */
export const union = (arr1, arr2) => {
  if (!Array.isArray(arr1)) arr1 = [];
  if (!Array.isArray(arr2)) arr2 = [];
  return removeDuplicates([...arr1, ...arr2]);
};

/**
 * Get difference between arrays
 * @param {Array} arr1 - First array
 * @param {Array} arr2 - Second array
 * @returns {Array} Difference
 */
export const difference = (arr1, arr2) => {
  if (!Array.isArray(arr1)) return [];
  if (!Array.isArray(arr2)) return arr1;
  return arr1.filter(value => !arr2.includes(value));
};

/**
 * Sum array values
 * @param {Array} arr - Array of numbers
 * @returns {number} Sum
 */
export const sum = (arr) => {
  if (!Array.isArray(arr)) return 0;
  return arr.reduce((total, num) => total + num, 0);
};

/**
 * Average of array values
 * @param {Array} arr - Array of numbers
 * @returns {number} Average
 */
export const average = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return 0;
  return sum(arr) / arr.length;
};

/**
 * Get minimum value from array
 * @param {Array} arr - Array of numbers
 * @returns {number} Minimum value
 */
export const min = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return Math.min(...arr);
};

/**
 * Get maximum value from array
 * @param {Array} arr - Array of numbers
 * @returns {number} Maximum value
 */
export const max = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return Math.max(...arr);
};

/**
 * Paginate array
 * @param {Array} arr - Array to paginate
 * @param {number} page - Page number (1-indexed)
 * @param {number} pageSize - Items per page
 * @returns {Object} Pagination result
 */
export const paginate = (arr, page = 1, pageSize = 10) => {
  if (!Array.isArray(arr)) return { items: [], total: 0, page: 1, pageSize, totalPages: 0 };
  
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const items = arr.slice(startIndex, endIndex);
  const totalPages = Math.ceil(arr.length / pageSize);
  
  return {
    items,
    total: arr.length,
    page,
    pageSize,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

/**
 * Pluck property values from array of objects
 * @param {Array} arr - Array of objects
 * @param {string} key - Property key
 * @returns {Array} Array of values
 */
export const pluck = (arr, key) => {
  if (!Array.isArray(arr)) return [];
  return arr.map(item => item[key]);
};

/**
 * Count occurrences of values
 * @param {Array} arr - Array to count
 * @returns {Object} Count object
 */
export const countBy = (arr) => {
  if (!Array.isArray(arr)) return {};
  return arr.reduce((count, value) => {
    count[value] = (count[value] || 0) + 1;
    return count;
  }, {});
};

export default {
  removeDuplicates,
  removeDuplicatesByKey,
  chunk,
  flatten,
  shuffle,
  randomElement,
  randomElements,
  sortBy,
  groupBy,
  filterBy,
  findBy,
  contains,
  intersection,
  union,
  difference,
  sum,
  average,
  min,
  max,
  paginate,
  pluck,
  countBy,
};