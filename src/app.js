import express from "express";
import cors from 'cors';
import {createServer} from 'http';
import initSocket from "./init/socket.js";
import { loadGameAssets } from "./init/assets.js";


const app = express();
const server =createServer(app);
const PORT = 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static('public'));
initSocket(server);



app.get('/',(req,res)=>{
    res.send("Hello World!");
});

server.listen(PORT, async()=>{
    console.log(`Server is running on port ${PORT}`);

    try{
    //이곳에서 asset 읽어오게 끔!
    const assets = await loadGameAssets();
    console.log(assets);
    console.log('Assets loaded successfully');
    } catch(err){
        console.error('Failed to load game assets:',err);
    }
});


