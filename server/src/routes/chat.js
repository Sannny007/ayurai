import { Router } from 'express';
import { getAnswer } from '../services/answerService.js';

const router = Router();

router.post('/', async (req, res) => {
  const { message } = req.body;

  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (message.length > 2000) {
    return res.status(400).json({ error: 'Message is too long (max 2000 characters' });
  }

  try {
    const answer = await getAnswer(message.trim())
    res.json(answer)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate an answer' })
  }
});

export default router;
