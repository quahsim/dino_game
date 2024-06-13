import { sendEvent } from './socket.js';
import stageData from './assets/stage.json' with { type: 'json' };

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = true;
  currentStageIndex = 0; // Use an index to access stages in the array

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(deltaTime) {  
    // Increment the score based on deltaTime and the scorePerSecond of the current stage
    this.score += deltaTime * 0.001 * stageData.data[this.currentStageIndex].scorePerSecond;
  
    // Check if the current stage is the last one
    if (this.currentStageIndex === stageData.data.length - 1) {
      return;
    }
  
    // Check if the player has achieved the score required to advance to the next stage
    if (this.score >= stageData.data[this.currentStageIndex + 1].score) {
      console.log(`Stage ${this.currentStageIndex + 1} Clear`);
  
      // Send event to the server with current and target stage information
      sendEvent(11, {
        currentStage: stageData.data[this.currentStageIndex].id,
        targetStage: stageData.data[this.currentStageIndex + 1].id,
      });
  
      // Move to the next stage
      this.currentStageIndex++;
    }
  }

  getItem(itemId) {
    this.score += 0; // Placeholder for item collection logic
  }

  reset() {
    this.score = 0; // Reset score
    this.currentStageIndex = 0; // Reset to initial stage index
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
