import { WebSocketServer } from 'ws';
import { User } from './User';
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
    let user = new User(ws)
  ws.on('error', console.error);


  const initialdelay = setTimeout(()=>{
    const payload = {
      type : "connected"
       }
       ws.send(JSON.stringify(payload))
  },1000)
 

  ws.on('close', function message(data) {
    user.destroy()
    clearTimeout(initialdelay)
 });
  
});