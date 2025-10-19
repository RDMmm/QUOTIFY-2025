import express from 'express';
import { prisma } from '../prisma';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = express.Router();

// Public random quote
router.get('/random', async (req, res) => {
  const count = await prisma.quote.count();
  if (count === 0) return res.status(404).json({ message: 'No quotes' });
  const skip = Math.floor(Math.random() * count);
  const quote = await prisma.quote.findFirst({ skip });
  res.json(quote);
});

// Admin: paginated list
router.get('/', authenticateJWT, requireRole('admin'), async (req, res) => {
  const page = Math.max(1, parseInt(String(req.query.page || '1')));
  const perPage = Math.min(100, parseInt(String(req.query.perPage || '10')));
  const [quotes, total] = await Promise.all([
    prisma.quote.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.quote.count(),
  ]);
  res.json({ data: quotes, page, perPage, total });
});

// Admin: create
router.post('/', authenticateJWT, requireRole('admin'), async (req, res) => {
  const { text, author, category, imageUrl } = req.body;
  if (!text) return res.status(400).json({ message: 'Text is required' });
  const created = await prisma.quote.create({
    data: { text, author, category, imageUrl },
  });
  res.status(201).json(created);
});

export default router;
