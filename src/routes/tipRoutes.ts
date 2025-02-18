import express from 'express';
import { getTips, insertTip, deleteTip } from '../controllers/tipController.js';

const router = express.Router();

router.get('/', getTips);
router.post('/', insertTip);
router.delete('/:id', deleteTip);

export default router;
