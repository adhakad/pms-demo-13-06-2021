const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://pms-demo:@Aa1Bb2Hh3@@cluster0.ngu0t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology:true,useFindAndModify:false,});
var conn =mongoose.Collection;
var roomHostSchema =new mongoose.Schema({
    room_id: 
    {
      type:Number, 
    },
    roomH_id: 
    {
      type:String, 
    },
    start_date:
    {
      type:Number,
    }, 
    
    date:{ 
      type:Number,
      default: Date.now }
});

var roomHostModel = mongoose.model('roomHost', roomHostSchema);
module.exports=roomHostModel;

//mongodb+srv://pms-demo:@Aa1Bb2Hh3@@cluster0.ngu0t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority