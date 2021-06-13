$(document).ready(function(){
  getdata();
  function getdata(){
     $.ajax({
      type : "GET",
      url : "/get",
      dataType:'json',
      success:function(response){
        if(response.msg=='success'){
          var  student_id = response.student_id;
          var  teacher_id = response.teacher_id;
          var  student_name = response.student_name;
/************************************************************************************************************/
// show loading state
const loading = document.createElement("div");
const spin = document.createElement("div");
loading.setAttribute("class", "d-flex loading");
spin.classList.add("loading_spinner");

loading.appendChild(spin);
document.body.appendChild(loading);

const socket = io("/");
const peer = new Peer(student_id, {
  secure: true,
  host: "spanion-video-chat-peer.herokuapp.com",
});

const peers = {};
const videoGrid = document.getElementById("video-grid");
const videoText = document.createElement("div");
const videoItem = document.createElement("div");
videoItem.classList.add("video__item");
videoText.classList.add("video__name");
videoItem.append(videoText);

const video = document.createElement("video");
video.muted = true;

const mediaConfig = {
  video: true,
  audio: true,
};

peer.on("open", (id) => {
  if (loading) loading.remove();
  socket.emit("join-room", ROOM_ID, { id, name: student_name });
  navigator.mediaDevices
    .getUserMedia(mediaConfig)
    .then((stream) => {
      addVideoStream(video, stream, id, student_name);
      peer.on("call", (call) => {
        call.answer(stream);
        const video = document.createElement("video");
        call.on("stream", (userStream) => {
          const userId = call.peer;
          const userName = call.metadata.name;
          addVideoStream(video, userStream, userId, userName);
        });
      });
      socket.on("user-connected", ({ id, name }) => {
        connectToNewUser({ id, name }, stream);
      });
    })
    .catch((err) => {
      document.write(err);
    });
});

socket.on("user-disconnected", ({ id }) => {
  const video = document.getElementById(id);
  if (video) {
    video.parentElement.remove();
  }
  if (peers[id]) peers[id].close();
});

function connectToNewUser({ id, name }, stream) {
  const call = peer.call(id, stream, { metadata: { name: student_name } });
  const video = document.createElement("video");
  call.on("stream", (userStream) => {
    addVideoStream(video, userStream, id, name);
  });
  call.on("close", () => {
    video.remove();
  });
  peers[id] = call;
}

function addVideoStream(video, stream, id, name) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  video.setAttribute("id", id);
  const clonedItem = videoItem.cloneNode(true);
  clonedItem.children[0].innerHTML = name;
  clonedItem.append(video);
  videoGrid.append(clonedItem);
  // weird error cleanup
  const nodes = document.querySelectorAll(".video__item") || [];
  nodes.forEach((node) => {
    if (node.children && node.children.length < 2) {
      node.remove();
    }
  });
}
/************************************************************************************************************/
  
      }
   },
          error:function(response){
              alert('server error');
          }
      });
    
  } 
});
