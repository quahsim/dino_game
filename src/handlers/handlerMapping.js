//각 핸들러에 고유 ID를 부여해서 호출하는 방법

import { gameEnd, gameStart } from "./game.handler.js";
import { moveStageHandler } from "./stage.handler.js";

const handlerMappings={
    2:gameStart,
    3:gameEnd,
    11:moveStageHandler,
};

export default handlerMappings;