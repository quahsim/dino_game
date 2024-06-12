//read assets files in the asset folder

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

let gameAssets = {};

//FIND PATH
//절대경로 찾을수 있응
const __filename = fileURLToPath(import.meta.url);
//이 파일의 위치에 파일 이름을 제외한 directory 경로를 나타냄
const __dirname = path.dirname(__filename);
//최상위 경로 + assets 폴더
const basePath = path.join(__dirname, '../../assets');

//파일 읽는 함수
//비동기 병렬로 파일을 읽음 (가장 늦게 끝나는 작업이 끝날때까지 기달리는것! stage.json / item.json / item_unlock.json)
const readFileAsync = (filename) => { //filename -> 파일 하나늘 읽어주는 함수
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => { //utf8 => 우리가 읽을 수 있는 문자로 변환!
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

//promise.all() -> 3파일들을 한번에 읽을수 있는 함수
export const loadGameAssets = async () => {
  try {
    const [stages, items, itemUnlocks] = await Promise.all([
      readFileAsync('stage.json'),
      readFileAsync('item.json'),
      readFileAsync('item_unlock.json'),
    ]);
    
    gameAssets = { stages, items, itemUnlocks };
    return gameAssets;
  } catch (err) {
    throw new Error('Failed to load game' + err.message);
  }
};

export const getGameAssets = () => {
  return gameAssets;
};
