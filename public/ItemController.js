import Item from './Item.js';
import { score } from './index.js';
import itemUnlocksData from './assets/item_unlock.json' with { type: 'json' };

class ItemController {
  INTERVAL_MIN = 0;
  INTERVAL_MAX = 12000;

  nextInterval = null;
  items = [];
  currentStageIndex = 0;

  constructor(ctx, itemImages, scaleRatio, speed) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.itemImages = itemImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;

    this.setNextItemTime();
  }

  setNextItemTime() {
    this.nextInterval = this.getRandomNumber(this.INTERVAL_MIN, this.INTERVAL_MAX);
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  createItem() {
    // Get the current stage ID
    const currentStageId = itemUnlocksData.data[this.currentStageIndex].stage_id;

    // Find the unlocked items for the current stage
    const stageItemsUnlock = itemUnlocksData.data.find((data) => data.stage_id === currentStageId);

    // Get the IDs of the unlocked items
    const unlockedItemIds = stageItemsUnlock.item_id;

    // Select a random item ID from the unlocked items
    const index = this.getRandomNumber(0, unlockedItemIds.length - 1);
    const itemId = unlockedItemIds[index];

    // Find the item information based on the selected item ID
    const itemInfo = this.itemImages.find((item) => item.id === itemId);

    // Check if the item information is valid
    if (!itemInfo) {
      console.error('No item found with the given ID in itemImages.');
      return;
    }
    const x = this.canvas.width * 1.5;
    const y = this.getRandomNumber(10, this.canvas.height - itemInfo.height);

    const item = new Item(
      this.ctx,
      itemInfo.id,
      x,
      y,
      itemInfo.width,
      itemInfo.height,
      itemInfo.image,
    );

    this.items.push(item);
  }

  update(gameSpeed, deltaTime) {
    this.currentStageIndex = score.currentStageIndex;
    if (this.nextInterval <= 0) {
      this.createItem();
      this.setNextItemTime();
    }

    this.nextInterval -= deltaTime;

    this.items.forEach((item) => {
      item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
    });

    this.items = this.items.filter((item) => item.x > -item.width);
  }

  draw() {
    this.items.forEach((item) => item.draw());
  }

  collideWith(sprite) {
    const collidedItem = this.items.find((item) => item.collideWith(sprite));
    if (collidedItem) {
      this.ctx.clearRect(collidedItem.x, collidedItem.y, collidedItem.width, collidedItem.height);
      return {
        itemId: collidedItem.id,
      };
    }
  }

  reset() {
    this.items = [];
  }
}

export default ItemController;
