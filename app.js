const workerpool = require('workerpool');
const pool  = workerpool.pool({maxWorkers: 7});
 
//Include api modules.
const http    = require('http');
const express = require('express');
const port    = 8000;

//Start Express-js.
const app    = express();
const server = http.createServer(app);

//Run heavy process.
const heavyTask = ()=>{

  let count = 0;
  for (let i=0;i<=5000000000000 ;i++)
      count++;
      
  return count;

}

//Heavy process load in the pool.
const heavyTaskInWorker = async()=>{

  const result = await pool.exec(heavyTask, []);
  console.log('xxxx',result);

  pool.terminate();
  return result;

}

//Mocked endpoint 1.
const mockTest_1_GET = (re,res) => {

  res.status(200).json({'MOCK 1':100000});

}

//Mocked endpoint 2.
const mockTest_2_GET = async (re,res) => {

  const total = await heavyTaskInWorker();
  res.status(200).json({'MOCK 2':total});

}

//Route binding.
app.get('/test_1', mockTest_1_GET);
app.get('/test_2', mockTest_2_GET);

//Start server.
app.listen(port, () => console.log('> Server start in port',port));





















