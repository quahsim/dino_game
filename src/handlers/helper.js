import { CLIENT_VERSION } from '../constants.js';
import { createStage, setStage } from '../models/stage.model.js';
import { createItem } from '../models/item.model.js';
import { getUsers, removeUser } from '../models/users.model.js';
import handlerMappings from './handlerMapping.js';

//해당 스테이지에 대한 정복를 담기 위한 바구니
export const handleConnection = (socket, userUUID) => {
    console.log(`New user connected! : ${userUUID} with socket ID ${socket.id}`);
    console.log('Current users', getUsers());
  
    // 스테이지 빈 배열 생성
    createStage(userUUID);
    //아이템 빈배열 생성
    createItem(userUUID);
  
    socket.emit('connection', { uuid: userUUID});
  };

export const handleDisconnect = (socket, uuid) => {
  removeUser(socket.id); //사용자 삭제
  console.log(`User disconnected:${socket.id}`);
  console.log('Current users', getUsers());
};

//버전이 맞는지는 이벤트에서 항상 검증을 해줘야함
export const handlerEvent = (io, socket, data) => {
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    socket.emit('response', { status: 'fail', message: 'Client version mismatch' });
    return;
  }
  //mappings 연동
  const handler = handlerMappings[data.handlerId];
  if (!handler) {
    socket.emit('response', { status: 'fail', message: 'Handler not found' });
    return;
  }
  // 적절한 핸들러에 userID 와 payload를 전달하고 결과를 받습니다.
  const response = handler(data.userId, data.payload);
  // 만약 결과에 broadcast (모든 유저에게 전달)이 있다면 broadcast 합니다.
  if (response.broadcast) {
    io.emit('response', 'broadcast');
    return;
  }
  // 해당 유저에게 적절한 response를 전달합니다.
  socket.emit('response', response);
};
