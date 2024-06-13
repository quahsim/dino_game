// import { getGameAssets } from '../init/assets.js';

// Stores items for each user
const items = {};

// Create item storage for a user
export const createItem = (uuid) => {
  items[uuid] = [];
};

// Get items for a user
export const getItem = (uuid) => {
  return items[uuid];
};

// Set item for a user
export const setItem = (uuid, id) => {
  return items[uuid].push({ id });
};

// Clear items for a user
export const clearItem = (uuid) => {
  items[uuid] = [];
};

