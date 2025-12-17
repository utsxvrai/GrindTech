const { Server } = require("socket.io");
const { STTService } = require("../services");

function initSocket(server){
    const io = new Server(server,{
        cors: {
            origin:[
                "https://grindtech.vercel.app",
                "http://localhost:5173",
            ]
        },
    });

    io.on("connection", async (socket) => {
        console.log("🎤 Client connected:", socket.id);

        let sttConnection = null;

        socket.on("start-stt", async () => {
            if (sttConnection) return; // Already started
            
            console.log("🎤 Starting STT session for:", socket.id);
            try {
                sttConnection = await STTService.createSTTSession((payload) => {
                    socket.emit("stt-transcript", payload);
                });
                console.log("🎤 Session created. Methods:", Object.keys(sttConnection));
                console.log("🎤 Prototype Methods:", Object.keys(Object.getPrototypeOf(sttConnection)));
            } catch (error) {
                console.error("Failed to start STT session:", error);
                socket.emit("stt-error", { message: "Failed to start STT session" });
            }
        });

        // Receive audio from frontend
        socket.on("audio-chunk", (audioBuffer) => {
            if (sttConnection) {
                try {
                    const audioBase64 = audioBuffer.toString("base64");
                    sttConnection.send({
                        audioBase64: audioBase64
                    });
                } catch (error) {
                     // console.error("Error sending audio chunk:", error.message);
                }
            }
        });

        socket.on("stop-stt", async () => {
             if (sttConnection) {
                console.log("🎤 Stopping STT session for:", socket.id);
                try {
                    await sttConnection.commit();
                } catch (e) {
                    console.error("Error committing STT:", e);
                }
                sttConnection.close();
                sttConnection = null;
            }
        });

        socket.on("disconnect", () => {
            if (sttConnection) {
                sttConnection.close();
                sttConnection = null;
            }
            console.log("❌ Client disconnected:", socket.id);
        });
    });
}

module.exports = {
    initSocket
}
