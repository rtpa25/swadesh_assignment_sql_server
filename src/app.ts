import express from 'express';
import { logger } from './utils/logger.util';

import userRouter from './routes/user.route';
import transactionRouter from './routes/transaction.route';

const main = () => {
  const app = express();

  app.use(express.json());

  //@health-check
  app.get('/', (_, res) => {
    res.send('Hello from server');
  });

  //@routes
  app.use('/api/users', userRouter);
  app.use('/api/transactions', transactionRouter);

  app.listen(8080, async () => {
    logger.info('Server is running on http://localhost:8080');
  });
};

main();
