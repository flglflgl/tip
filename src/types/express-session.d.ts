import session from 'express-session';

declare module 'express-session' {
    interface SessionData {
        githubUser?: {
            username: string;
            profileUrl: string;
            avatarUrl: string;
            accessToken: string;
        };
    }
}

declare module 'express' {
    interface Request {
        session: session.Session & Partial<session.SessionData>;
    }
}
