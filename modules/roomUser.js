const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://pms-demo:@Aa1Bb2Hh3@@cluster0.ngu0t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology:true,useFindAndModify:false,});
var conn =mongoose.Collection;
var roomUserSchema =new mongoose.Schema({
    room_id: {
        type:Number, 
        },
    roomU_id: {type:String, 
        },        
});

var roomUserModel = mongoose.model('roomUser', roomUserSchema);
module.exports=roomUserModel;

//mongodb+srv://pms-demo:@Aa1Bb2Hh3@@cluster0.ngu0t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority