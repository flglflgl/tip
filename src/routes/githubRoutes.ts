import express, { Request, Response } from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import session from 'express-session';

dotenv.config();
const router = express.Router();

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_URI = process.env.GITHUB_REDIRECT_URI;

// Session middleware (Ensure you add this in your main app)
router.use(session({
    secret: 'your_secret_key', // Change this to a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// GitHub Login Route
router.get('/github', (req: Request, res: Response) => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=read:user user:email`;
    res.redirect(githubAuthUrl);
});

// GitHub Callback Route
router.get('/callback', async (req: Request, res: Response) => {
    const code = req.query.code as string;

    if (!code) {
        res.status(400).send('GitHub authentication failed. No code received.');
        return;
    }

    try {
        // Exchange code for access token
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code }),
        });

        const tokenData = await tokenResponse.json() as { access_token: string };
        const accessToken = tokenData.access_token;

        if (!accessToken) {
            res.status(400).send('Failed to get access token');
            return;
        }

        // Fetch user details from GitHub API
        const userResponse = await fetch('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const user = await userResponse.json() as { login: string; avatar_url: string; html_url: string };

        // Store user session
        req.session.githubUser = {
            username: user.login,
            profileUrl: user.html_url,
            avatarUrl: user.avatar_url,
            accessToken, // Store token for API access
        };

        // Redirect to index.html with user info
        res.redirect(`/?github_user=${user.login}&github_url=${encodeURIComponent(user.html_url)}`);
    } catch (error) {
        console.error('GitHub OAuth Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Logout Route
router.get('/logout', (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Logout failed');
        } else {
            res.redirect('/?logout=success'); // Redirect to index with a logout message
        }
    });
});

export default router;
