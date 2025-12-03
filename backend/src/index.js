const express = require("express");
const routes = require("./routes");

const app = express();
const cors = require('cors');

app.use(cors({
    origin: 'https://grindtech.vercel.app',
    credentials: true
}));

app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf.toString();
    }
}));
app.use('/api',routes);


app.listen(3000,()=>{
    console.log("Server running on port 3000")
});


