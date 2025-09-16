
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

module.exports = function configurePassport() {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
        scope: ['user:email']
      },
     
      async (accessToken, refreshToken, profile, done) => {
        try {
          const githubId = profile.id;
          const username = profile.username || profile.displayName || '';

          const email = profile.emails && profile.emails[0] && profile.emails[0].value
            ? profile.emails[0].value
            : null;
          const avatarUrl = profile._json && profile._json.avatar_url ? profile._json.avatar_url : null;

          let user = await User.findOne({ githubId });

          if (!user) {
            user = await User.create({
              githubId,
              username,
              email,
              avatarUrl
            });
          } else {
        
            let changed = false;
            if (email && user.email !== email) { user.email = email; changed = true; }
            if (avatarUrl && user.avatarUrl !== avatarUrl) { user.avatarUrl = avatarUrl; changed = true; }
            if (changed) await user.save();
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );


  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
