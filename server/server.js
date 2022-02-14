require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
const session = require("client-sessions");
const path = require('path');
const {DBconnect , findUser , authUser , getData , getAllData , addFriend , writeMSG} = require("./utils.js");


app.use(cors());

const io = require('socket.io')(3002,{
    cors:{
        origin:['http://localhost:3001']
    }
})



let users = [];
io.on('connection',socket=>{
    const id = socket.handshake.query.id;
    socket.join(id)
    if(!users.find(item=>item===id)){
        users.push(id);
    }
    socket.on('logged',()=>{
        socket.emit('users-logged',(users));
        socket.broadcast.emit('new-users-logged',id);
    })
    socket.on('disconnect',()=>{
        let index = users.findIndex(item=>{
            return item === id
        })
        users.splice(index,1)
        socket.broadcast.emit('disconnected-users',id);
    })


    
    socket.on('send-msg',(data)=>{
        writeMSG(id,data)
        .then(res=>{
            if(res){
                socket.broadcast.to(data.recipient.id).emit('recived-msg',data);
            }
        })
    })

})




app.use(express.urlencoded({extended: true}));
app.use(express.json({limit:'1mb'}));


app.use(express.static(path.resolve(__dirname, "../public/build")));



app.use(session({
    cookieName:"session",
    secret:"cookieSecret12345",
    duration:30*60*1000*2,//30 min
    cookie: {
        path: '*', // cookie will only be sent to requests under '/api'
        ephemeral: false, // when true, cookie expires when the browser closes
        httpOnly: false, // when true, cookie is not accessible from javascript
        secure: false // when true, cookie will only be sent over SSL. use key 'secureProxy' instead if you handle SSL not in your node process
      }
}))


app.post('/login',(req,res)=>{
    authUser(req.body.username,req.body.id)
    .then((docs)=>{
        if(docs){
            req.session.userId = req.body.id;
            res.json(true);
        }else{
            res.json(false);
        }
    })
})


app.get('/signout',(req,res)=>{
    res.json(true);
})

app.get('/data',(req,res)=>{
    getData(req.session.userId)
    .then((docs)=>{
        if(docs){
            getAllData()
            .then((data)=>{
                res.json({docs,data})
            })
        }
    })
})

app.post('/register',(req,res)=>{
    if(req.body.username.length !== 0){
        findUser(req.body.username,req.body.id,req.body.color)
        .then((docs)=>{
            if(docs){
                req.session.userId = req.body.id;
                res.json(true);
            }else{
                res.json(false)
            }
        })
    }else{
        res.json(false)
    }
})

app.post('/addFriend',(req,res)=>{
    addFriend(req.session.userId,req.body)
    res.json('true from server!!!')
})

app.get("*", function (req, res) {
    res.sendFile(path.resolve(__dirname, "../public/build", "index.html"));
});

DBconnect()
    .then((something)=>{
        if(something){
            const PORT = process.env.PORT || 3001;
            app.listen(PORT,()=>{console.log(`server started at port ${PORT} along DB!!!`)});
        }
    })
    .catch((err)=>{
        console.log(err);
    })