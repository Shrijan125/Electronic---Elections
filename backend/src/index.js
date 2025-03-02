import https from 'https';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiV1Router from './routes/route.js';
import connectDB from './db/index.js';

dotenv.config({ path: "./.env" });


const app = express();

app.use(cors(
    {
        origin: 'https://localhost:5173',
        credentials: true
    }
));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

app.use("/api/v1", apiV1Router);

const options = {
    key: fs.readFileSync('cert/server.key'),
    cert: fs.readFileSync('cert/server.crt'),
    ca: fs.readFileSync('cert/ca.crt'),
  };

  connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error: ", error);
      throw error;
    });
    const PORT = process.env.PORT || 8000;
    https.createServer(options, app).listen(PORT, () => {
      console.log('Server running on https://localhost:3000');
    });
  
  })
  .catch((err) => {
    console.log("Mongo db connection failed", err);
    process.exit(1);
  });

  
 
