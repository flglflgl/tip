import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_URI = process.env.GITHUB_REDIRECT_URI;
// GitHub login
router.get('/github', (req, res) => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=read:user user:email`;
    res.redirect(githubAuthUrl);
});
// GitHub callback
router.get('/callback', async (req, res) => {
    const code = req.query.code;
    if (!code) {
        res.status(400).send('GitHub authentication failed. No code received.');
        return;
    }
    try {
        const response = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code }),
        });
        const data = (await response.json());
        const accessToken = data.access_token;
        if (!accessToken) {
            res.status(400).send('Failed to get access token');
            return;
        }
        const userResponse = await fetch('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        const user = (await userResponse.json());
        // Redirect to index.html
        res.redirect(`/?github_user=${user.login}&github_url=${encodeURIComponent(user.html_url)}`);
    }
    catch (error) {
        console.error('GitHub OAuth Error:', error);
        res.status(500).send('Internal Server Error');
    }
});
export default router;
