import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth';
import quotesRoutes from './routes/quotes';
import seedAdmin from './seed';

dotenv.config();
const app = express();
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/quotes', quotesRoutes);

// Seed admin on start (non-blocking)
seedAdmin().catch((e) => console.error('Seed failed:', e));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on ${port}`));
