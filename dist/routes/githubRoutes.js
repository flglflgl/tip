import express from 'express';
import { githubLogin, githubCallback, githubLogout } from '../controllers/githubController.js';
const router = express.Router();
router.get('/github', githubLogin);
router.get('/callback', githubCallback);
router.get('/logout', githubLogout);
export default router;
