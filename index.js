var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cors = require('cors')
var { addUser, getUser } = require('./users')
app.use(cors())
app.get('/', function(req, res){
  res.send('server connected');
});

io.on('connection', (socket) => {
    socket.on('join', ({ name, room}, callback) => {
      const { error, user } = addUser({ id: socket.id, name, room})
      if(error) return callback(error)
      socket.emit('message', { user: 'admin', text: `welcome ${user.name} has joined`})
      socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined`})
      socket.join(user.room)
      callback()
    })

    socket.on('sendMessage', (message, callback) => {
      const user = getUser(socket.id)
      io.to(user.room).emit('message', { user: "name", text: message })
      callback()
    })

    socket.on('disconnect', () => {
      console.log(`user has disconnected`)
    })
  });


http.listen(4000, function(){
  console.log('listening on *:3000');
});