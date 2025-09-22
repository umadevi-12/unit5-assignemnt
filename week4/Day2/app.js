const EventEmitter = require('events');

const evenEmitter = new EventEmitter();

evenEmitter.on('userLoggedIn' ,(username) =>{
    console.log(`> User ${username} logged in`);
});
evenEmitter.on('userLoggedIn' ,(username) =>{
    console.log(`> Notification sent to ${username}`);
} );

evenEmitter.on('messageRecevied' , (from,message) =>{
    console.log(`> Message received from ${from} : "${message}"`);
});

evenEmitter.on('dataSynced' ,(username) =>{
    console.log(`> Syncing user data ${username}...`);
    setTimeout(() =>{
        console.log(`> Data sync complete`)
    },1000)
});

function simulateSystem(){
    const user = 'John';
    setTimeout(()=>{
        evenEmitter.emit('userLoggedIn' ,user);
    },500);

    setTimeout(() =>{
        evenEmitter.emit('messageRecevied' ,"Alice" ,"Hey John! How are you?");
    },1500);

    setTimeout(() =>{
        evenEmitter.emit('dataSynced' ,user);
    },2500);
}

simulateSystem();