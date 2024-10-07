const express = require("express");
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const path = require('path');
// const connectToMongo = require('./db');

// connectToMongo();
const app = express();
const port = process.env.PORT || 3000; // Use environment variable for port

app.use(express.json());
app.use(cors());

// Create an HTTP server
const server = http.createServer(app);

// Attach Socket.IO to the server
const io = new Server(server, {
    cors: true
});

// API routes
app.use('/api/auth', require('./routes/auth'));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../build')));

// The "catchall" handler: for any request that doesn't match one above, send back index.html.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});

// Socket.io setup

const ETS = new Map();
const STE = new Map();

io.on("connection", (socket) =>{
    socket.on("join-room", (data)=>{
        console.log(data);
        const {room} = data;
        console.log(room);
        // ETS.set(email, socket.id);
        // STE.set(socket.id, email);
        
        io.to(room).emit("user-joined", {id: socket.id});
        socket.join(room);
        io.to(socket.id).emit("joined-room", data);
        // socket.join(room, () => {
        //     console.log("joining");
        //     io.to(room).emit("user-joined", { id: socket.id });
        //     io.to(socket.id).emit("joined-room", data);
        // });
    })

    socket.on("call-user", (data)=>{
        const {to, offer} = data;
        io.to(to).emit('incoming-call', {from: socket.id, offer});
    })

    socket.on("call-accepted", (data)=>{
        const {to, ans} = data;
        io.to(to).emit("call-accepted", {from: socket.id, ans});
    })

    socket.on("nego-needed", (data)=>{
        const {offer, to} = data;
        io.to(to).emit("nego-needed", {from: socket.id, offer})
    })

    socket.on("nego-done", (data)=>{
        const {to, ans} = data;
        io.to(to).emit("nego-final", {from: socket.id, ans});
    })
})

server.listen(port, () => {
    console.log(`Running on port ${port}`);
});