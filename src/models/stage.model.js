//스테이지에 따라서 더 높은 점수 획득! 
//현재 유저가 어떤 스테이지 있다는 정보를 담고 있는 바구니? 구현

//key:uuid , value:array -> stage정보는 배열
const stages ={};

export const createStage = (uuid) => {
  stages[uuid] = []; // 초기 스테이지 배열 생성
};

export const getStage = (uuid) => {
  return stages[uuid];
};

export const setStage = (uuid, id, timestamp) => {
  return stages[uuid].push({ id, timestamp });
};

export const clearStage = (uuid)=>{
    stages[uuid]=[];
};
