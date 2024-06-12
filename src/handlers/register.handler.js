//유저 관리!

import { v4 as uuidv4 } from 'uuid';
import { addUser } from '../models/users.model.js';
import { handleConnection, handleDisconnect, handlerEvent } from './helper.js';

const registerHandler = (io) => {
  io.on('connection', (socket) => {
    // 최초 커넥션을 맺은 이후 발생하는 각종 이벤트를 처리하는 곳

    const userUUID = uuidv4(); // UUID 생성
    addUser({ uuid: userUUID, socketId: socket.id }); // 사용자 추가

    //해당 스테이지에 대한 정복를 담기 위한 바구니
    handleConnection(socket, userUUID);

    //event라는 이름으로 발생하는 모든 이벤트는 handlerEvent라는 함수로 처리
    socket.on('event',(data) => handlerEvent(io,socket,data));

    //접속 해제시 이벤트
    socket.on('disconnect', (socket) => handleDisconnect(socket, userUUID));
  });
};

export default registerHandler;
