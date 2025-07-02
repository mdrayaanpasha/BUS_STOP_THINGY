import express, { Request, Response } from 'express';
import AuthRouter from './routers/auth.router';

const app = express();

app.get('/', (req: Request, res: Response): void => {
    res.send('Hello, World!');
});

app.use(express.json());
app.use('/auth', AuthRouter);


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});