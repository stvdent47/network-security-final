'use strict';

require('dotenv').config();

const express = require('express');
const session = require('express-session');
const { passport } = require('./passport');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        // name: 'sessionId',
        name: 'sid',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 1_000,
        },
    })
)

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send(`
        <h1>Welcome to the OAuth2 Authentication App</h1>
        <div>
            ${ req.isAuthenticated()
                ? `<div>
                    <p>Authorised</p>
                    <a href='/profile'>Profile</a>
                </div>`
                : `<div>
                    <p>Unauthorised</p>
                    <a href='/login'>Login</a>
                </div>`
            }
        </div>
    `)
});

app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${ PORT }`);
});
