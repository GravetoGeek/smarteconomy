import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import router from './routes';

const app = express();

const port:number = Number(process.env.NODE_PORT) || 8000;
const host:string = process.env.NODE_HOST || 'localhost';
app.use(cors());
// { origin: `http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}` }
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('',router)






app.listen(port, ()=>{
  console.log(`Servidor online: http://${host}:${port}`);
})