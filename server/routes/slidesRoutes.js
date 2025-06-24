
import express from 'express';
import { Slide, slidesDB } from '../models/Slide.js';

const router = express.Router();

router.get('/slides', async (req, res) => {
  const slides = await Slide.findAll({ order: [['order', 'ASC']] });
  res.json(slides);
});

router.post('/slides', async (req, res) => {
  const { title, content, layout, imageUrl } = req.body;
  const count = await Slide.count();
  const slide = await Slide.create({
    title,
    content,
    layout: layout || 'default',
    imageUrl: imageUrl || null,
    order: count,
  });
  res.status(201).json(slide);
});

router.put('/slides/:id', async (req, res) => {
  const slide = await Slide.findByPk(req.params.id);
  if (!slide) return res.status(404).json({ error: 'Slide not found' });

  const { title, content, layout, imageUrl } = req.body;
  slide.title = title;
  slide.content = content;
  slide.layout = layout || 'default';
  slide.imageUrl = imageUrl || null;

  await slide.save();
  res.json(slide);
});

router.delete('/slides/:id', async (req, res) => {
  const slide = await Slide.findByPk(req.params.id);
  if (!slide) return res.status(404).json({ error: 'Slide not found' });

  await slide.destroy();
  res.json({ success: true });
});

export default router;
