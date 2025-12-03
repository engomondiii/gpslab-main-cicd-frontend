/**
 * GPS Lab Platform - Array Helper Utilities
 * 
 * Comprehensive array manipulation utilities for the GPS Lab MMORPG educational platform.
 * Handles sorting, filtering, grouping, and array transformations.
 * 
 * @module utils/helpers/array.helper
 * @version 1.0.0
 */

// =============================================================================
// TYPE CHECKING
// =============================================================================

/**
 * Checks if value is an array
 * @param {*} value - Value to check
 * @returns {boolean} True if array
 */
export const isArray = (value) => Array.isArray(value);

/**
 * Checks if array is empty
 * @param {Array} arr - Array to check
 * @returns {boolean} True if empty or not an array
 */
export const isEmpty = (arr) => !isArray(arr) || arr.length === 0;

/**
 * Checks if array is not empty
 * @param {Array} arr - Array to check
 * @returns {boolean} True if not empty
 */
export const isNotEmpty = (arr) => isArray(arr) && arr.length > 0;

/**
 * Ensures value is an array
 * @param {*} value - Value to convert
 * @returns {Array} Array value
 */
export const ensureArray = (value) => {
  if (isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [value];
};

// =============================================================================
// ARRAY ACCESS
// =============================================================================

/**
 * Gets first element of array
 * @param {Array} arr - Source array
 * @param {*} defaultValue - Default if empty
 * @returns {*} First element or default
 */
export const first = (arr, defaultValue = undefined) => {
  return isNotEmpty(arr) ? arr[0] : defaultValue;
};

/**
 * Gets last element of array
 * @param {Array} arr - Source array
 * @param {*} defaultValue - Default if empty
 * @returns {*} Last element or default
 */
export const last = (arr, defaultValue = undefined) => {
  return isNotEmpty(arr) ? arr[arr.length - 1] : defaultValue;
};

/**
 * Gets element at index (supports negative indexing)
 * @param {Array} arr - Source array
 * @param {number} index - Index (negative counts from end)
 * @param {*} defaultValue - Default if out of bounds
 * @returns {*} Element or default
 */
export const at = (arr, index, defaultValue = undefined) => {
  if (!isArray(arr)) return defaultValue;
  const i = index < 0 ? arr.length + index : index;
  return i >= 0 && i < arr.length ? arr[i] : defaultValue;
};

/**
 * Gets random element from array
 * @param {Array} arr - Source array
 * @returns {*} Random element or undefined
 */
export const random = (arr) => {
  if (isEmpty(arr)) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * Gets n random elements from array
 * @param {Array} arr - Source array
 * @param {number} n - Number of elements
 * @returns {Array} Random elements
 */
export const sample = (arr, n = 1) => {
  if (isEmpty(arr)) return [];
  const shuffled = shuffle([...arr]);
  return shuffled.slice(0, Math.min(n, arr.length));
};

// =============================================================================
// ARRAY TRANSFORMATION
// =============================================================================

/**
 * Shuffles array using Fisher-Yates algorithm
 * @param {Array} arr - Array to shuffle
 * @returns {Array} Shuffled copy
 */
export const shuffle = (arr) => {
  if (!isArray(arr)) return [];
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/**
 * Reverses array (immutable)
 * @param {Array} arr - Array to reverse
 * @returns {Array} Reversed copy
 */
export const reverse = (arr) => {
  if (!isArray(arr)) return [];
  return [...arr].reverse();
};

/**
 * Flattens nested array to specified depth
 * @param {Array} arr - Array to flatten
 * @param {number} depth - Depth to flatten
 * @returns {Array} Flattened array
 */
export const flatten = (arr, depth = 1) => {
  if (!isArray(arr)) return [];
  return arr.flat(depth);
};

/**
 * Flattens array completely
 * @param {Array} arr - Array to flatten
 * @returns {Array} Fully flattened array
 */
export const flattenDeep = (arr) => {
  if (!isArray(arr)) return [];
  return arr.flat(Infinity);
};

/**
 * Removes duplicates from array
 * @param {Array} arr - Array with duplicates
 * @param {Function} keyFn - Optional key function for comparison
 * @returns {Array} Array with unique values
 */
export const unique = (arr, keyFn = null) => {
  if (!isArray(arr)) return [];
  
  if (keyFn) {
    const seen = new Set();
    return arr.filter(item => {
      const key = keyFn(item);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
  
  return [...new Set(arr)];
};

/**
 * Removes falsy values from array
 * @param {Array} arr - Array to compact
 * @returns {Array} Array without falsy values
 */
export const compact = (arr) => {
  if (!isArray(arr)) return [];
  return arr.filter(Boolean);
};

/**
 * Removes null and undefined values
 * @param {Array} arr - Array to clean
 * @returns {Array} Array without null/undefined
 */
export const removeNulls = (arr) => {
  if (!isArray(arr)) return [];
  return arr.filter(item => item !== null && item !== undefined);
};

// =============================================================================
// SORTING
// =============================================================================

/**
 * Sorts array by key (ascending)
 * @param {Array} arr - Array to sort
 * @param {string|Function} key - Key or getter function
 * @returns {Array} Sorted copy
 */
export const sortBy = (arr, key) => {
  if (!isArray(arr)) return [];
  
  const getValue = typeof key === 'function' ? key : (item) => item[key];
  
  return [...arr].sort((a, b) => {
    const aVal = getValue(a);
    const bVal = getValue(b);
    
    if (aVal < bVal) return -1;
    if (aVal > bVal) return 1;
    return 0;
  });
};

/**
 * Sorts array by key (descending)
 * @param {Array} arr - Array to sort
 * @param {string|Function} key - Key or getter function
 * @returns {Array} Sorted copy
 */
export const sortByDesc = (arr, key) => {
  return reverse(sortBy(arr, key));
};

/**
 * Sorts array by multiple keys
 * @param {Array} arr - Array to sort
 * @param {Array} keys - Array of {key, order} objects
 * @returns {Array} Sorted copy
 */
export const sortByMultiple = (arr, keys) => {
  if (!isArray(arr) || !isArray(keys)) return arr;
  
  return [...arr].sort((a, b) => {
    for (const { key, order = 'asc' } of keys) {
      const getValue = typeof key === 'function' ? key : (item) => item[key];
      const aVal = getValue(a);
      const bVal = getValue(b);
      
      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

/**
 * Sorts numbers in ascending order
 * @param {Array<number>} arr - Array of numbers
 * @returns {Array<number>} Sorted copy
 */
export const sortNumbers = (arr) => {
  if (!isArray(arr)) return [];
  return [...arr].sort((a, b) => a - b);
};

/**
 * Sorts strings alphabetically (locale-aware)
 * @param {Array<string>} arr - Array of strings
 * @param {string} locale - Locale for comparison
 * @returns {Array<string>} Sorted copy
 */
export const sortStrings = (arr, locale = 'en') => {
  if (!isArray(arr)) return [];
  return [...arr].sort((a, b) => String(a).localeCompare(String(b), locale));
};

// =============================================================================
// FILTERING
// =============================================================================

/**
 * Filters array by predicate and returns matches and non-matches
 * @param {Array} arr - Array to partition
 * @param {Function} predicate - Filter function
 * @returns {Array} [matches, nonMatches]
 */
export const partition = (arr, predicate) => {
  if (!isArray(arr)) return [[], []];
  
  const matches = [];
  const nonMatches = [];
  
  arr.forEach(item => {
    if (predicate(item)) {
      matches.push(item);
    } else {
      nonMatches.push(item);
    }
  });
  
  return [matches, nonMatches];
};

/**
 * Filters array to items matching all conditions
 * @param {Array} arr - Array to filter
 * @param {Object} conditions - Key-value conditions
 * @returns {Array} Filtered array
 */
export const where = (arr, conditions) => {
  if (!isArray(arr)) return [];
  
  return arr.filter(item => {
    return Object.entries(conditions).every(([key, value]) => {
      return item[key] === value;
    });
  });
};

/**
 * Finds first item matching conditions
 * @param {Array} arr - Array to search
 * @param {Object} conditions - Key-value conditions
 * @returns {*} First match or undefined
 */
export const findWhere = (arr, conditions) => {
  return first(where(arr, conditions));
};

/**
 * Rejects items matching predicate (opposite of filter)
 * @param {Array} arr - Array to filter
 * @param {Function} predicate - Filter function
 * @returns {Array} Filtered array
 */
export const reject = (arr, predicate) => {
  if (!isArray(arr)) return [];
  return arr.filter(item => !predicate(item));
};

// =============================================================================
// GROUPING
// =============================================================================

/**
 * Groups array by key
 * @param {Array} arr - Array to group
 * @param {string|Function} key - Key or getter function
 * @returns {Object} Grouped object
 */
export const groupBy = (arr, key) => {
  if (!isArray(arr)) return {};
  
  const getValue = typeof key === 'function' ? key : (item) => item[key];
  
  return arr.reduce((groups, item) => {
    const groupKey = getValue(item);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {});
};

/**
 * Counts items by key
 * @param {Array} arr - Array to count
 * @param {string|Function} key - Key or getter function
 * @returns {Object} Count by key
 */
export const countBy = (arr, key) => {
  if (!isArray(arr)) return {};
  
  const getValue = typeof key === 'function' ? key : (item) => item[key];
  
  return arr.reduce((counts, item) => {
    const groupKey = getValue(item);
    counts[groupKey] = (counts[groupKey] || 0) + 1;
    return counts;
  }, {});
};

/**
 * Creates lookup object from array
 * @param {Array} arr - Array to index
 * @param {string|Function} key - Key or getter function
 * @returns {Object} Lookup object
 */
export const keyBy = (arr, key) => {
  if (!isArray(arr)) return {};
  
  const getValue = typeof key === 'function' ? key : (item) => item[key];
  
  return arr.reduce((lookup, item) => {
    lookup[getValue(item)] = item;
    return lookup;
  }, {});
};

/**
 * Creates Map from array
 * @param {Array} arr - Array to map
 * @param {string|Function} key - Key or getter function
 * @returns {Map} Lookup map
 */
export const toMap = (arr, key) => {
  if (!isArray(arr)) return new Map();
  
  const getValue = typeof key === 'function' ? key : (item) => item[key];
  
  return new Map(arr.map(item => [getValue(item), item]));
};

// =============================================================================
// SET OPERATIONS
// =============================================================================

/**
 * Returns intersection of two arrays
 * @param {Array} arr1 - First array
 * @param {Array} arr2 - Second array
 * @returns {Array} Common elements
 */
export const intersection = (arr1, arr2) => {
  if (!isArray(arr1) || !isArray(arr2)) return [];
  const set2 = new Set(arr2);
  return arr1.filter(item => set2.has(item));
};

/**
 * Returns difference of two arrays (arr1 - arr2)
 * @param {Array} arr1 - First array
 * @param {Array} arr2 - Second array
 * @returns {Array} Elements in arr1 not in arr2
 */
export const difference = (arr1, arr2) => {
  if (!isArray(arr1)) return [];
  if (!isArray(arr2)) return [...arr1];
  const set2 = new Set(arr2);
  return arr1.filter(item => !set2.has(item));
};

/**
 * Returns symmetric difference of two arrays
 * @param {Array} arr1 - First array
 * @param {Array} arr2 - Second array
 * @returns {Array} Elements in either but not both
 */
export const symmetricDifference = (arr1, arr2) => {
  return [...difference(arr1, arr2), ...difference(arr2, arr1)];
};

/**
 * Returns union of two arrays (unique)
 * @param {Array} arr1 - First array
 * @param {Array} arr2 - Second array
 * @returns {Array} Combined unique elements
 */
export const union = (arr1, arr2) => {
  return unique([...ensureArray(arr1), ...ensureArray(arr2)]);
};

// =============================================================================
// CHUNKING AND SLICING
// =============================================================================

/**
 * Splits array into chunks of specified size
 * @param {Array} arr - Array to chunk
 * @param {number} size - Chunk size
 * @returns {Array} Array of chunks
 */
export const chunk = (arr, size) => {
  if (!isArray(arr) || size < 1) return [];
  
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

/**
 * Takes first n elements
 * @param {Array} arr - Source array
 * @param {number} n - Number of elements
 * @returns {Array} First n elements
 */
export const take = (arr, n = 1) => {
  if (!isArray(arr)) return [];
  return arr.slice(0, n);
};

/**
 * Takes last n elements
 * @param {Array} arr - Source array
 * @param {number} n - Number of elements
 * @returns {Array} Last n elements
 */
export const takeLast = (arr, n = 1) => {
  if (!isArray(arr)) return [];
  return arr.slice(-n);
};

/**
 * Drops first n elements
 * @param {Array} arr - Source array
 * @param {number} n - Number of elements to drop
 * @returns {Array} Remaining elements
 */
export const drop = (arr, n = 1) => {
  if (!isArray(arr)) return [];
  return arr.slice(n);
};

/**
 * Drops last n elements
 * @param {Array} arr - Source array
 * @param {number} n - Number of elements to drop
 * @returns {Array} Remaining elements
 */
export const dropLast = (arr, n = 1) => {
  if (!isArray(arr)) return [];
  return arr.slice(0, -n || arr.length);
};

// =============================================================================
// AGGREGATION
// =============================================================================

/**
 * Sums array of numbers
 * @param {Array<number>} arr - Array of numbers
 * @returns {number} Sum
 */
export const sum = (arr) => {
  if (!isArray(arr)) return 0;
  return arr.reduce((total, n) => total + (Number(n) || 0), 0);
};

/**
 * Sums array by key
 * @param {Array} arr - Array of objects
 * @param {string|Function} key - Key or getter function
 * @returns {number} Sum
 */
export const sumBy = (arr, key) => {
  if (!isArray(arr)) return 0;
  const getValue = typeof key === 'function' ? key : (item) => item[key];
  return arr.reduce((total, item) => total + (Number(getValue(item)) || 0), 0);
};

/**
 * Calculates average of array
 * @param {Array<number>} arr - Array of numbers
 * @returns {number} Average
 */
export const average = (arr) => {
  if (isEmpty(arr)) return 0;
  return sum(arr) / arr.length;
};

/**
 * Finds minimum value
 * @param {Array<number>} arr - Array of numbers
 * @returns {number} Minimum
 */
export const min = (arr) => {
  if (isEmpty(arr)) return undefined;
  return Math.min(...arr);
};

/**
 * Finds maximum value
 * @param {Array<number>} arr - Array of numbers
 * @returns {number} Maximum
 */
export const max = (arr) => {
  if (isEmpty(arr)) return undefined;
  return Math.max(...arr);
};

/**
 * Finds minimum value by key
 * @param {Array} arr - Array of objects
 * @param {string|Function} key - Key or getter function
 * @returns {*} Item with minimum value
 */
export const minBy = (arr, key) => {
  if (isEmpty(arr)) return undefined;
  const getValue = typeof key === 'function' ? key : (item) => item[key];
  return arr.reduce((minItem, item) => 
    getValue(item) < getValue(minItem) ? item : minItem
  );
};

/**
 * Finds maximum value by key
 * @param {Array} arr - Array of objects
 * @param {string|Function} key - Key or getter function
 * @returns {*} Item with maximum value
 */
export const maxBy = (arr, key) => {
  if (isEmpty(arr)) return undefined;
  const getValue = typeof key === 'function' ? key : (item) => item[key];
  return arr.reduce((maxItem, item) => 
    getValue(item) > getValue(maxItem) ? item : maxItem
  );
};

// =============================================================================
// GPS LAB SPECIFIC HELPERS
// =============================================================================

/**
 * Sorts missions by stage and mission number
 * @param {Array} missions - Array of mission objects
 * @returns {Array} Sorted missions
 */
export const sortMissions = (missions) => {
  return sortByMultiple(missions, [
    { key: 'stageNumber', order: 'asc' },
    { key: 'missionNumber', order: 'asc' }
  ]);
};

/**
 * Groups checkpoints by mission
 * @param {Array} checkpoints - Array of checkpoint objects
 * @returns {Object} Checkpoints grouped by missionId
 */
export const groupCheckpointsByMission = (checkpoints) => {
  return groupBy(checkpoints, 'missionId');
};

/**
 * Filters completed items
 * @param {Array} items - Array of items with isCompleted property
 * @returns {Array} Completed items
 */
export const filterCompleted = (items) => {
  return where(items, { isCompleted: true });
};

/**
 * Filters incomplete items
 * @param {Array} items - Array of items with isCompleted property
 * @returns {Array} Incomplete items
 */
export const filterIncomplete = (items) => {
  return where(items, { isCompleted: false });
};

/**
 * Calculates completion percentage
 * @param {Array} items - Array of items with isCompleted property
 * @returns {number} Completion percentage (0-100)
 */
export const calculateCompletionRate = (items) => {
  if (isEmpty(items)) return 0;
  const completed = filterCompleted(items).length;
  return Math.round((completed / items.length) * 100);
};

/**
 * Sorts leaderboard by Baraka (descending)
 * @param {Array} users - Array of user objects
 * @returns {Array} Sorted users with rank
 */
export const sortLeaderboard = (users) => {
  const sorted = sortByDesc(users, 'barakaBalance');
  return sorted.map((user, index) => ({
    ...user,
    rank: index + 1
  }));
};

/**
 * Gets users in a party
 * @param {Array} users - All users
 * @param {string} partyId - Party ID
 * @returns {Array} Party members
 */
export const getPartyMembers = (users, partyId) => {
  return where(users, { partyId });
};

/**
 * Groups stages by adventure
 * @param {Array} stages - Array of stage objects
 * @returns {Object} Stages grouped by adventureNumber
 */
export const groupStagesByAdventure = (stages) => {
  return groupBy(stages, 'adventureNumber');
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Type checking
  isArray,
  isEmpty,
  isNotEmpty,
  ensureArray,
  
  // Access
  first,
  last,
  at,
  random,
  sample,
  
  // Transformation
  shuffle,
  reverse,
  flatten,
  flattenDeep,
  unique,
  compact,
  removeNulls,
  
  // Sorting
  sortBy,
  sortByDesc,
  sortByMultiple,
  sortNumbers,
  sortStrings,
  
  // Filtering
  partition,
  where,
  findWhere,
  reject,
  
  // Grouping
  groupBy,
  countBy,
  keyBy,
  toMap,
  
  // Set operations
  intersection,
  difference,
  symmetricDifference,
  union,
  
  // Chunking
  chunk,
  take,
  takeLast,
  drop,
  dropLast,
  
  // Aggregation
  sum,
  sumBy,
  average,
  min,
  max,
  minBy,
  maxBy,
  
  // GPS Lab specific
  sortMissions,
  groupCheckpointsByMission,
  filterCompleted,
  filterIncomplete,
  calculateCompletionRate,
  sortLeaderboard,
  getPartyMembers,
  groupStagesByAdventure
};