const { Server } = require("socket.io");
const { STTService } = require("../services");

function initSocket(server){
    const io = new Server(server,{
        cors: {
            origin: "*", // tighten later
        },
    });

    io.on("connection", async (socket) => {
    console.log("🎤 Client connected:", socket.id);

    // Create ElevenLabs STT session
    const sttConnection = await STTService.createSTTSession((payload) => {
      socket.emit("stt-transcript", payload);
    });

    // Receive audio from frontend
    socket.on("audio-chunk", (audioBuffer) => {
      if (sttConnection) {
        sttConnection.send(audioBuffer);
      }
    });

    socket.on("stop-stt", () => {
      sttConnection?.close();
    });

    socket.on("disconnect", () => {
      sttConnection?.close();
      console.log("❌ Client disconnected:", socket.id);
    });
  });
}

module.exports = {
    initSocket
}
