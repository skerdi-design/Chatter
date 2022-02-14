const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let userDB = process.env.MONGODB_CONNECTION_STRING


function DBconnect (){
    return new Promise((res,rej)=>{
        mongoose.connect(userDB,{useNewUrlParser:true,useUnifiedTopology:true})
        .then(()=>{
            res(true);
        })
        .catch((err)=>{
            rej(fasle);
        })
    })
}
const userSchema = new Schema({
    username:String,
    id:String,
    color:String,
    status: Boolean,
    active: Boolean,
    messages:Array
})
const user = mongoose.model("chat-user", userSchema);

function findUser (username,id,color) {
    return new Promise((res,rej)=>{
        user.find({username:username},(err,doc)=>{
            if(doc.length == 0){
                user.find({id:id},(err,doc)=>{
                    if(doc.length == 0){
                        res(id);
                        const appUser = new user({
                            username:username,
                            id:id,
                            color:color,
                            status:false,
                            active:false,
                            messages:[],
                        })
                        appUser.save();
                    }else{
                        res(undefined);
                    }
                });
            }else{
                res(null);
            }
        });
    })
}

function authUser (username,id) {
    return new Promise((res,rej)=>{
        user.find({username:username},(err,docs)=>{
            if(docs.length == 0){
                res(null);
            }else if(docs.length > 1){
                res(null);
            }else{
                let idStatus = id === docs[0].id
                if(!idStatus){
                    res(null);
                    return;
                }
                res(docs[0]);
            }
        })
    })
};

function getData(id) {
    return new Promise((res,rej)=>{
        user.find({id:id},(err,docs)=>{
            if(docs.length == 0){
                res(null);
            }else if(docs.length > 1){
                res(undefined);
            }else{
                res(docs[0]);
            }
        })
    })
}
function getAllData(){
    return new Promise((res,rej)=>{
        user.find({},(err,docs)=>{
            res(docs);
        })
    })
}
function addFriend (id,data) {
    return new Promise((res,rej)=>{
        user.find({id:id},(err,docs)=>{
            if(docs.length === 0){
                res(false)
            }else{
                user.updateOne({id:id},{$addToSet:{messages:data}},(err,numreplaced)=>{
                    if(err)throw(err);
                    res(true)
                });
            }
        })
    })
}








function writeMSG(id,{sentFrom,recipient,msg,time}) {
    return new Promise((res,rej)=>{
        user.find({id:id},(err,docs)=>{
            if(docs[0].length === 0){
                res(fasle)
            }else{
                let textObj = {
                    text:msg,
                    time,time
                }
                let messages = docs[0].messages;
                let index = messages.findIndex(item=>{
                    return item.id === recipient.id
                });
                if(messages[index].conversation.length === 0){
                    messages[index].conversation.push({
                        text:[textObj],
                        sentFrom:sentFrom,
                        recipient:recipient
                    });
                }else{
                    if(messages[index].conversation[messages[index].conversation.length-1].recipient.id === recipient.id){
                        messages[index].conversation[messages[index].conversation.length-1].text.push(textObj);
                    }else{
                        messages[index].conversation.push({
                            text:[textObj],
                            sentFrom:sentFrom,
                            recipient:recipient
                        });
                    }
                }
                user.updateOne({id:id},{$set:{messages:messages}},{},(err,numreplaced)=>{
                    user.find({id:recipient.id},(err,docs)=>{
                        if(docs[0].length === 0){
                            res(false)
                        }else{
                            let textReciObj = {
                                text:msg,
                                time,time
                            };
                            let reciMessages = docs[0].messages;
                            let reciIndex = reciMessages.findIndex(rItem=>{
                                return rItem.id === sentFrom.id
                            });
                            if(reciIndex >= 0){
                                if(reciMessages[reciIndex].conversation.length === 0){
                                    reciMessages[reciIndex].conversation.push({
                                        text:[textReciObj],
                                        sentFrom:sentFrom,
                                        recipient:recipient
                                    });
                                }else{
                                    if(reciMessages[reciIndex].conversation[reciMessages[reciIndex].conversation.length-1].recipient.id === recipient.id){
                                        reciMessages[reciIndex].conversation[reciMessages[reciIndex].conversation.length-1].text.push(textReciObj);
                                    }else{
                                        reciMessages[reciIndex].conversation.push({
                                            text:[textReciObj],
                                            sentFrom:sentFrom,
                                            recipient:recipient
                                        })
                                    };
                                }
                            }else{
                                let tempUser = {
                                    username:sentFrom.username,
                                    id:sentFrom.id,
                                    color:sentFrom.color,
                                    status:false,
                                    active:false,
                                    conversation:[{
                                        text:[textReciObj],
                                        sentFrom:sentFrom,
                                        recipient:recipient
                                    }]
                                }
                                reciMessages.push(tempUser);
                            }
                            user.updateOne({id:recipient.id},{$set:{messages:reciMessages}},{},(err,numreplaced)=>{
                                res(true)
                            })
                        }
                    })
                })
            }
        })
    })
}




module.exports={DBconnect , findUser , authUser , getData , getAllData , addFriend , writeMSG}