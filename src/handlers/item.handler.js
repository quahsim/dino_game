import { getGameAssets } from '../init/assets.js';
import { getStage } from '../models/stage.model.js';
import { getItem, setItem } from '../models/item.model.js';

export const getItemHandler = (userId, payload) => {
  let currentStages = getStage(userId);
  const { itemId, itemScore, currentStage } = payload; 

  const { items, itemUnlocks } = getGameAssets();

  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // Sort stages to find the current stage (highest ID)
  currentStages.sort((a, b) => a.id - b.id);
  const highestStage = currentStages[currentStages.length - 1];

  // Compare the current stage with the payload's current stage
  if (highestStage.id !== currentStage) {
    return { status: 'fail', message: 'Current stage mismatch' };
  }

  // Check if the item can be unlocked in the current stage
  const stageUnlockItem = itemUnlocks.data.find(data => data.stage_id === currentStage);
  console.log(`Stage Unlock Item:`, stageUnlockItem); 

  if (!stageUnlockItem || !stageUnlockItem.item_id.includes(itemId)) {
    return { status: 'fail', message: 'Item cannot be unlocked in this stage' };
  }

  // Validate item score
  const itemData = items.data.find(item => item.id === itemId);
  if (!itemData || itemData.score !== itemScore) {
    return { status: 'fail', message: 'Invalid item score' };
  }

  // Unlocks item for user
  setItem(userId, itemId);
  return { status: 'success' };
};
