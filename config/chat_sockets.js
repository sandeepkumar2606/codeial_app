
// module.exports.chatSockets = function(socketServer){
//     const io = require('socket.io')(socketServer);

//     io.sockets.on('connection', function(socket){
//         console.log('new connection received',socket.id);

//         socket.on('disconnect',function(){
//             console.log('socket disconnected!');
//         });


//         socket.on('join_room',function(data){
//             console.log('joining request received',data);

//             socket.join(data.chatroom);

//             io.in(data.chatroom).emit('user_joined',data);
//         });

//         socket.on('send_message', function(data){
//             io.in(data.chatroom).emit('receive_message',data);
//         })

//     });

// }



module.exports.chatSockets = function(socketServer){
    
    // let io = require('socket.io')(socketServer);  //original but this is not working

    // let io = require('socket.io')(socketServer, {
    //     cors: {
    //       origin: '*',
    //     }
    //   });
    
    // io = require('socket.io')(socketServer);

    const Server = require('socket.io');
    //It will be handling the connections
    let io = Server(socketServer, {
        // Fixing the cors issue
        cors: {
            origin: "http://localhost:8000",
            credentials: true
        },
        allowEIO3: true // false by default
    });
    
        io.sockets.on('connection', function(socket){
        console.log('new connection received', socket.id);

        socket.on('disconnect', function(){
            console.log('socket disconnected!');
        });

        
        socket.on('join_room', function(data){
            console.log('joining request rec.', data);

            socket.join(data.chatroom);

            io.in(data.chatroom).emit('user_joined', data);
        });

        socket.on('send_message', function(data){
            io.in(data.chatroom).emit('receive_message', data);
        });

    });

}