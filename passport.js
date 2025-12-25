const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const users = new Map();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            passReqToCallback: true,
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                const user = {
                    id: profile.id,
                    displayName: profile.displayName,
                    emails: profile.emails || [],
                    photos: profile.photos || [],
                    tokens: { accessToken, refreshToken },
                };

                users.set(user.id, user);

                return done(null, user);
            }
            catch (error) {
                return done(error, null);
            }
        },
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    done(
        null,
        users.get(id) || null
    )
});

module.exports = { passport, users };
