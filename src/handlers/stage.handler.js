//user는 스테이지를 하나씩 올라갈수 있다 (1stage -> 2, 2->3)
//유저는 일정 점수가 되면 다음 스테이지로 이동한다

import { getStage, setStage } from '../models/stage.model.js';
import { getGameAssets } from '../init/assets.js';

export const moveStageHandler = (userId, payload) => {
  // 유저의 현재 스테이지 배열을 가져오고, 최대 스테이지 ID를 찾는다.
  let currentStages = getStage(userId);
  const { stages } = getGameAssets();

  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 오름차순 정렬 후 가장 큰 스테이지 ID 확인 = 가장 상위의 스테이지 = 현재 스테이지
  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];

  // payload 의 currentStage 와 비교
  if (currentStage.id !== payload.currentStage) {
    return { status: 'fail', message: 'Current stage mismatch' };
  }

  // 점수 검증
  const serverTime = Date.now();

  // 게임 에셋에서 다음 스테이지의 존재 여부 확인
  const nextStage = stages.data.find((stage) => stage.id === payload.targetStage);
  if (!nextStage) {
    return { status: 'fail', message: 'Target stage does not exist' };
  }

  // 점수 검증
  const requiredScore = nextStage.score;

  // 오차범위 5점
  if (payload.score < requiredScore - 5 || payload.score > requiredScore + 5) {
    return { status: 'fail', message: 'Invalid score' };
  }

  // 유저의 다음 스테이지 정보 업데이트 + 현재 시간
  setStage(userId, payload.targetStage, serverTime);
  return { status: 'success' };
};
