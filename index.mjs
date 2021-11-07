import cookieParser from 'cookie-parser';
import express from 'express';
import methodOverride from 'method-override';
import cors from "cors";
// CUSTOM IMPORTS
import db from './models/index.mjs';
import auth from './middleware.mjs';
import bindRoutes from './routes.mjs';

import { Server } from 'socket.io';
import http from 'http';
import registerGridHandlers from './registerGridHandlers.mjs'
import registerChatHandlers from './registerChatHandlers.mjs'
// Initialise Express instance

const app = express();

// Set the Express view engine to expect EJS templates
app.set('view engine', 'ejs');
// Bind cookie parser middleware to parse cookies in requests
app.use(cookieParser());
// Bind Express middleware to parse request bodies for POST requests
app.use(express.urlencoded({ extended: false }));
app.use(cors());
// Bind Express middleware to parse JSON request bodies
app.use(express.json());
// Bind method override middleware to parse PUT and DELETE requests sent as POST requests
app.use(methodOverride('_method'));
// Expose the files stored in the public folder
app.use(express.static('public'));
// Expose the files stored in the distribution folder
app.use(express.static('dist'));

// Set up Webpack in dev env
const env = process.env.NODE_ENV || 'development';
if (env === 'development') {

  // conditionally / dynamically import the webpack libraries we need in the dev environment
  // a dynamic import syntax is called as a function and returns a promise
  // use await so that every line is executed in order
  // see more here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#dynamic_import

  // destructure the default import and name the variable
  // see more here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#importing_defaults
  const { default: webpack } = await import('webpack')
  const { default: webpackDevMiddleware } =  await import('webpack-dev-middleware');
  const { default: webpackHotMiddleware } = await import('webpack-hot-middleware');
  const { default: webpackConfig } = await import('./webpack_conf/webpack.dev.js');

  const compiler = webpack(webpackConfig);

  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    // html only
    writeToDisk: (filePath) => /\.html$/.test(filePath),
  }));
  app.use(webpackHotMiddleware(compiler, {
    log: false,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000,
  }));
}

// Auth
app.use(auth(db));

// Bind route definitions to the Express application
bindRoutes(app);

// sockets
const server = http.createServer(app);

const PORT = process.env.PORT || 3004;
const PORTSOCKET = 3001;

let io = new Server(server);
io = io.listen(server);

const chatUsers = [];
const onConnection= (socket)=>{
  console.log(`User connected ${socket.id}`);

  registerGridHandlers(io, socket);

  socket.on('chat:join', (data) => {
    const obj = {
      room: data.room,
      socketId: socket.id,
      username: data.username,
      userId: data.userId,
      realName: data.realName
    }
    chatUsers.push(obj);
    socket.join(data.room);
    const hour = new Date(Date.now()).getHours();
    const min = new Date(Date.now()).getMinutes();
    const hourFmt = (hour.toString().length === 1 ? `0${hour}` : `${hour}`);
    const minFmt = (min.toString().length === 1 ? `0${min}` : `${min}`);
    const messageData = {
      room: data.room,
      username: data.username,
      userId: data.userId,
      realName: data.realName,
      message: '',
      time: `${hourFmt}:${minFmt}`,
      context: 'connected',
    };
    socket.to(data.room).emit('chat:receive', messageData);
  });

  registerChatHandlers(io, socket);

  socket.on("disconnect", ()=>{
    let index = -1;
    let userObj = {};

    for (let i = 0; i < chatUsers.length; i += 1) {
      if (chatUsers[i].socketId === socket.id) {
        index = i;
      }
    } 

    if (index > -1) {
      userObj = chatUsers.splice(index, 1)[0];
    }

    if (Object.keys(userObj).length > 0) {
      const hour = new Date(Date.now()).getHours();
      const min = new Date(Date.now()).getMinutes();
      const hourFmt = (hour.toString().length === 1 ? `0${hour}` : `${hour}`);
      const minFmt = (min.toString().length === 1 ? `0${min}` : `${min}`);
      
      const messageData = {
        room: userObj.room,
        username: userObj.username,
        userId: userObj.userId,
        realName: userObj.realName,
        message: '',
        time: `${hourFmt}:${minFmt}`,
        context: 'disconnected',
      };
      socket.to(userObj.room).emit('chat:receive', messageData);
    }
  })
}

// server.listen(PORTSOCKET);
io.on("connection", onConnection);

server.listen(PORT);
