const express = require("express");
const http = require("http");
const {Server} = require("socket.io")
const cors = require("cors")

const app = express()
app.use(cors({
  origin: ["http://localhost:5173","https://real-time-whiteboard-pink.vercel.app/"],
  methods: ["GET", "POST"],
  credentials: true
}));

const server = http.createServer(app)
const io = new Server(server,{
    cors: {
        origin: ["http://localhost:5173","https://real-time-whiteboard-pink.vercel.app/"],
        methods: ["GET", "POST"],
        credentials: true
    }
})


server.listen(5001, () => {
    console.log("Server running on port 5000");
});

io.on("connection", (socket) => {
    console.log("connected", socket.id);

    socket.on("join" ,(data)=>{
        socket.join(data)
    })

    socket.on("undo", (data)=>{
        socket.to(data.roomId).emit("undo")
    })

    socket.on("disconnect", () => {
        console.log("disconnected", socket.id)
    })

    socket.on("mess", (data) => {
        io.to(data.roomId).emit("mess",data)
    })

    socket.on("stop" ,(data)=>{
        socket.to(data.roomId).emit("stop",data.currentStroke)
    })
})
