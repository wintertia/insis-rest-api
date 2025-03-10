import express from 'express';
import cors from 'cors';
import connectDB from './db-connection';
import supplyRouter from './routes/supply.route';
import transactionRouter from './routes/transaction.route';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
  })
);

app.use(express.json());

connectDB();

app.get("/", (_, response) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };
  const formattedDate = new Date().toLocaleDateString('en-US', options);

  response.status(200).send({
    status: "Success 😎",
    message: "Welcome to Integrasi Sistem API 😃",
    date: formattedDate,
  });
});

app.use('/supply', supplyRouter);
app.use('/transaction', transactionRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Express is running on Port ${PORT}`);
});
