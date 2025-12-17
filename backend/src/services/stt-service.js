const { ElevenLabsClient, RealtimeEvents } = require("@elevenlabs/elevenlabs-js");

const elevenLabsClient = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

async function createSTTSession(onTranscript) {
  const connection = await elevenLabsClient.speechToText.realtime.connect({
    modelId: "scribe_v2_realtime",
    audioFormat: "pcm_16000",
    sampleRate: 16000,
    includeTimestamps: true,
  });

  connection.on(RealtimeEvents.PARTIAL_TRANSCRIPT, (data) => {
    onTranscript({ type: "partial", data });
  });

  connection.on(RealtimeEvents.COMMITTED_TRANSCRIPT, (data) => {
    onTranscript({ type: "final", data });
  });

  connection.on(RealtimeEvents.ERROR, console.error);

  return connection;
}

module.exports = { createSTTSession };
