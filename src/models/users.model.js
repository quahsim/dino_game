//저장소..! 우리 서버 메모리에만 올려놓기..!

const users = [];

//서버 메모리에 유저의 세션(소켓ID)을 저장
//이때 유저는 객체 형태로 저장
//{uuid : string, socketId:string;};
export const addUser =(user)=>{
    users.push(user)
};

//유저를 지우는 함수
export const removeUser = (socketId)=>{
    const index = users.findIndex((user)=>user.socketId===socketId);
    if (index!==-1){
        return users.splice(index,1)[0];
    }
}
export const getUsers=()=>{
    return users;
}