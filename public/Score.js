import { sendEvent } from './socket.js';
import stageData from './assets/stage.json' with { type: 'json' };
import itemData from './assets/item.json' with { type: 'json' };
import itemUnlocksData from './assets/item_unlock.json' with { type: 'json' };

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = true;
  currentStageIndex = 0; 

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(deltaTime) {  
    this.score += deltaTime * 0.001 * stageData.data[this.currentStageIndex].scorePerSecond;
  
    // Check if the current stage is the last one
    if (this.currentStageIndex === stageData.data.length - 1) {
      return;
    }
  
    // Check if player has achieved the score required to advance to next stage
    if (this.score >= stageData.data[this.currentStageIndex + 1].score) {
      console.log(`Stage ${this.currentStageIndex + 1} Clear`);
  
      sendEvent(11, {
        currentStage: stageData.data[this.currentStageIndex].id,
        targetStage: stageData.data[this.currentStageIndex + 1].id,
      });
  
      // Move to the next stage
      this.currentStageIndex++;
    }
  }

  getItem(itemId) {
    const currentStage = stageData.data[this.currentStageIndex].id; 

    // Find item in the item data
    const item = itemData.data.find(item => item.id === itemId);
    if (!item) {
      console.error(`Item with ID ${itemId} not found`);
      return;
    }

    this.score +=item.score;

    // Check if item can be unlocked in current stage
    const stageUnlockData = itemUnlocksData.data.find(data => data.stage_id === currentStage);
    console.log(`New Items:`, stageUnlockData); // 

    if (!stageUnlockData || !stageUnlockData.item_id.includes(itemId)) {
      console.log('Item cannot be unlocked in this stage',itemId,currentStage);
      return { status: 'fail', message: 'Item cannot be unlocked in this stage' };
    }

    sendEvent(12, {
      currentStage,
      itemId,
      itemScore: item.score,
    });

    // Add the item's score to the total score
    this.score += item.score;
  }

  reset() {
    this.score = 0; 
    this.currentStageIndex = 0; 
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;
