const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://pms-demo:@Aa1Bb2Hh3@@cluster0.ngu0t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology:true,useFindAndModify:false,});
var conn =mongoose.Collection;
var studentUserSchema =new mongoose.Schema({
    student_name:{type:String,
    },
    class_name: {
        type:Number, 
        },
    student_id:{type:Number,
        required: true,
        index: {
            unique: true, 
        },},
    
    password: {
        type:String,
        required: true
    },
    status:{type:String,
    },
    date:{
        type: Date, 
        default: Date.now }
});

var studentUserModel = mongoose.model('studentUser', studentUserSchema);
module.exports=studentUserModel;
//mongodb+srv://pms-demo:@Aa1Bb2Hh3@@cluster0.ngu0t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
//mongodb://myUserAdmin:@Aa1Bb2Hh3@@127.0.0.1:27017/web?authSource=admin
