import { dbSetup } from './database/connection';
import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();

import { router } from './routes/routes';
app.use(express.json());

app.use('/api', router);

const port = process.env.APP_PORT;

// app.all('*', (req, res, next)=>{
//   response(res, 404, 'Page not found.')
// })

// app.use((err, req, res)=>{
//   if(err.message == 'invalid signature')
// })

dbSetup();

// app.get('/', function (req, res) {
//   res.send('Hello ');
// });
// app.listen(3000);
app.listen(port, () => {
  console.log(`Server is running on ${process.env.BASE_URL}`);
});
