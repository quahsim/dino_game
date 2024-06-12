import { sendEvent } from './socket.js';
import stageData from './assets/stage.json' with { type: 'json' };

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = true;
  currentStage = 0;
  stage = 0;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(deltaTime) {
    this.score += deltaTime * 0.001 * stageData.data[this.currentStage].scorePerSecond;
    if (this.currentStage ===6){
      return;
    }
    // Check if the player has achieved the score required to advance to the next stage
    if (Math.floor(this.score) === stageData.data[this.currentStage + 1].score) {
      this.stageChange = false; // Prevent further stage changes until the current one is processed
      console.log(`Stage ${this.currentStage + 1} Clear`);

      // Send event to the server with current and target stage information
      sendEvent(11, {
        currentStage: stageData.data[this.currentStage].id,
        targetStage: stageData.data[this.currentStage + 1].id,
      });
      // Move to the next stage
      this.currentStage++;
    }
  }

  getItem(itemId) {
    this.score += 0;
  }

  reset() {
    this.score = 0;
    this.currentStage =0;
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
