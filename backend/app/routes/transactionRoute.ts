import { Router } from 'express';
import { verifyJWT } from '../controllers/authController';
import { transaction_create, transaction_read, transaction_update, transaction_delete, transaction_list } from '../controllers/transactionController';

const transactionRoute = Router();
transactionRoute.post('/', verifyJWT, transaction_create);
transactionRoute.get('/:id', verifyJWT, transaction_read);
transactionRoute.put('/:id', verifyJWT, transaction_update);
transactionRoute.delete('/:id', verifyJWT, transaction_delete);
transactionRoute.get('/', verifyJWT, transaction_list);

export default transactionRoute;