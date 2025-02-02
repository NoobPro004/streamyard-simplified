import http from 'http';
import express from "express";
import path from "path";
import { spawn } from 'child_process';
import {Server as SocketIO} from 'socket.io'

const options = [
    '-i',
    '-',
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-tune', 'zerolatency',
    '-r', `${25}`,
    '-g', `${25 * 2}`,
    '-keyint_min', 25,
    '-crf', '25',
    '-pix_fmt', 'yuv420p',
    '-sc_threshold', '0',
    '-profile:v', 'main',
    '-level', '3.1',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-ar', 128000 / 4,
    '-f', 'flv',
    `rtmp://a.rtmp.youtube.com/live2/${your_youtube_api_key}`,
];

const ffmpeg_process = spawn('ffmpeg', options)

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);
app.use(express.static(path.resolve('./public')));
io.on("connection",(socket)=>{
    console.log("socket connected:  ",socket.id)
    socket.on('binaryStream',stream => {
        ffmpeg_process.stdin.write(stream, (err)=>{console.log(err) })
    })
})



server.listen(3000,()=>console.log("Server is running on port 3000"))