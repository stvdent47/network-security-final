const express = require('express');
const { passport } = require('./passport');

const router = express.Router();

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}

router.get('/auth/google', (req, res, next) => {
    req.session.oauthState = Math.random().toString(36).substring(2);
    passport.authenticate(
        'google',
        {
            scope: ['profile', 'email'],
            state: req.session.oauthState,
        },
    )(req, res, next);
});

router.get(
    '/auth/google/callback',
    (req, res, next) => {
        const { state } = req.query;

        if (state === undefined || state !== req.session.oauthState) {
            return res.status(403).send('Invalid OAuth2 state parameter.');
        }

        delete req.session.oauthState;

        next();
    },
    passport.authenticate('google', {
        failureRedirect: '/login',
    }),
    (req, res) => {
        res.redirect('/profile');
    }
);

router.get('/login', (req, res) => {
    res.send(`
        <h1>Login</h1>
        <div>
            <a href='/auth/google'>Login with Google</a>
        </div>
    `);
});

router.get('/logout', ensureAuthenticated, async (req, res) => {
    try {
        const refreshToken = req.user?.tokens?.refreshToken;
        if (refreshToken !== undefined) {
            const form = new URLSearchParams();
            
            form.set('token', refreshToken);

            await fetch(
                process.env.GOOGLE_TOKEN_REVOKE_URL,
                {
                    method: 'post',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: form.toString(),
                }
            )
        }
    }
    catch (error) {
        console.error('Error revoking token:', error);
    }

    req.logout((error) => {
        if (error) {
            return res.status(500).send('Error logging out');
        }

        req.session.destroy(() => {
            res.redirect('/');
        });
    });
});

router.get('/profile', ensureAuthenticated, async (req, res) => {
    try {
        const accessToken = req.user?.tokens?.accessToken;
        let info = null;
        if (accessToken !== undefined) {
            const response = await fetch(
                process.env.GOOGLE_USERINFO_URL,
                {
                    headers: { Authorization: `Bearer ${ accessToken }` },
                },
            );

            if (response.ok) {
                info = await response.json();
            }
        }

        res.send(`
            <h1>Display name: ${ req.user.displayName }</h1>
            <p>Email: ${ req.user.emails[0] ? req.user.emails[0].value : 'No email available' }</p>
            <p>Google user info: ${ info !== null ? JSON.stringify(info, null, 2) : 'No additional info available' }</p>
            <div>
                <a href='/logout'>Logout</a>
            </div>
        `)
    }
    catch (error) {
        res.status(500).send('Error fetching user info');
    }
});

module.exports = router;
