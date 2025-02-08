import express, { Request, Response } from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_URI = process.env.GITHUB_REDIRECT_URI;

router.get('/auth/github', (req: Request, res: Response) => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=read:user user:email`;
    res.redirect(githubAuthUrl);
});

// Handle GitHub callback
router.get('/auth/github/callback', async (req: Request, res: Response): Promise<void> => {
    const code = req.query.code as string;

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

        interface GitHubTokenResponse {
            access_token: string;
            token_type: string;
            scope: string;
          }
          
        const data = (await response.json()) as GitHubTokenResponse
        const accessToken = data.access_token;

        if (!accessToken) {
            res.status(400).send('Failed to get access token');
            return;
        }

        // Fetch user data from GitHub
        const userResponse = await fetch('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        interface GitHubUser {
            login: string;
            id: number;
            avatar_url: string;
            html_url: string;
            name?: string;
            email?: string;
          }
          
        const user = (await userResponse.json()) as GitHubUser
        res.send(`Hello, ${user.login}!`);
    } catch (error) {
        console.error('GitHub OAuth Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;
