const userVideo = document.getElementById('user-video');
const startButton = document.getElementById('start-button');
const state = {media:null}
const socket = io()



startButton.addEventListener('click',()=>{
    const mediaRecvorder = new MediaRecorder(state.media,{
        audioBitsPerSecond:12800,
        videoBitsPerSecond:250000,
        framerate:25
    })

    mediaRecvorder.ondataavailable = ev => {
        console.log("binary stream available: ",ev.data)
        socket.emit('binaryStream',ev.data)
    }

    mediaRecvorder.start(25)
})
window.addEventListener('load',async (e)=>{
    const media=await navigator.mediaDevices.getUserMedia({audio:true,video:true})
    state.media=media;
    userVideo.srcObject = media
})