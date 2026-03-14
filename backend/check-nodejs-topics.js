const axios = require('axios');

async function checkNodejsTopics() {
  try {
    // Get Node.js techId
    const techRes = await axios.get('http://localhost:3000/api/v1/tech/name/Node.Js');
    if (!techRes.data.data || !techRes.data.data.techId) {
      console.log('❌ Node.js tech not found:', techRes.data);
      return;
    }
    const techId = techRes.data.data.techId;
    console.log('✅ Node.js techId:', techId);

    // Get topics for Node.js
    const topicsRes = await axios.get(`http://localhost:3000/api/v1/topic/tech/${techId}`);
    if (!Array.isArray(topicsRes.data.data)) {
      console.log('❌ Topics response malformed:', topicsRes.data);
      return;
    }
    console.log(`✅ Found ${topicsRes.data.data.length} topics for Node.js`);
    topicsRes.data.data.forEach((topic, idx) => {
      console.log(`${idx + 1}. ${topic.name}`);
    });
  } catch (err) {
    console.error('❌ Error:', err.response ? err.response.data : err.message);
  }
}

checkNodejsTopics();
