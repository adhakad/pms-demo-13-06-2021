var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var server = require('http').Server(app);
const { v4: uuidV4 } = require("uuid");
var io = require('socket.io')(server)
var { ExpressPeerServer } = require('peer');
var peerServer = ExpressPeerServer(server, {
  debug: true
});
app.use('/peerjs', peerServer);

var indexRouter = require('./routes/index');
var dashboardRouter = require('./routes/dashboard');
var teacherRouter = require('./routes/admin/teacher/teacher');
var adminPanelRouter = require('./routes/admin/admin-panel');
var adminClassTeacherRouter = require('./routes/admin/classTeacher/classTeacher');
var totalAdminClassRouter = require('./routes/admin/totalAdminClass/totalAdminClass'); 
var adminTotalClassListRouter = require('./routes/admin/totalAdminClass/totalAdminClassList');
var adminDashboardRouter = require('./routes/admin/admin-dashboard');
var adminStudentListRouter = require('./routes/admin/student/studentList');
var studentUserRouter = require('./routes/admin/student/studentUser');
var teacherAdminPanelRouter = require('./routes/adminTeacher/teacher-admin-panel');
var teacherAdminDashboardRouter = require('./routes/adminTeacher/teacher-admin-dashboard');
var getStudentUserRouter = require('./routes/studentUser/getStudentUser');

app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret:'~K]d9@5LEpD}t267',
  resave:false,
  saveUninitialized:true,
}));

var roomHost = require('./modules/roomHost');
var roomUser = require('./modules/roomUser');
var teacherUserModule=require('./modules/teacher');
var studentUserModule=require('./modules/studentUser');

var student_id;
app.get('/room/:id/:student_id', (req, res) => {
  var abcd = req.params.id;
  student_id = req.params.student_id;
  res.redirect('/'+abcd);
  app.get('/:id',function(req, res, next) {
    res.render('room', {roomId: req.params.id}); 
  });
});

app.get('/get',function(req, res, next) {
  var studentUser=studentUserModule.findOne({student_id:student_id});
  studentUser.exec((err,data)=>{
    if(err) throw err;
    if(err){
      res.send({msg:'error'});
    }else{
      var student_id = data.student_id;
      var student_name = data.student_name;
      var teacherUser=teacherUserModule.findOne({teacher_uid:student_id});
      teacherUser.exec((err,data)=>{
        if(data){
          var teacher_id = data.teacher_uid;
          res.send({msg:'success',student_id:student_id,teacher_id:teacher_id,student_name:student_name});
        }else{
          var teacher_id = 1234567890;
          res.send({msg:'success',student_id:student_id,teacher_id:teacher_id,student_name:student_name});
        }
      })
    }
  });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, { id, name = uuidV4() }) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", { id, name });

    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", { id, name });
    });
  });
});

  /*io.on("connection", (socket) => {
    socket.on("join-room", (roomId, id) => { 
      socket.join(roomId);
      socket.to(roomId).broadcast.emit("user-connected", id);
      socket.on("disconnect", () => {
        socket.to(roomId).broadcast.emit("user-disconnected", id);
      });
    });
  });*/

app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);
app.use('/teacher', teacherRouter);
app.use('/admin-panel', adminPanelRouter);
app.use('/classTeacher', adminClassTeacherRouter);
app.use('/totalAdminClass', totalAdminClassRouter);
app.use('/totalAdminClassList', adminTotalClassListRouter);
app.use('/studentList', adminStudentListRouter);
app.use('/studentUser', studentUserRouter);
app.use('/admin-dashboard', adminDashboardRouter);
app.use('/teacher-admin-panel', teacherAdminPanelRouter);
app.use('/teacher-admin-dashboard', teacherAdminDashboardRouter);
app.use('/getStudentUser', getStudentUserRouter);


server.listen(process.env.PORT||3000)