const config = require('config');
const faker = require('faker');
const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;

const JWTStrategy = Strategy; // avoid confusion about what does what below
const fields = {
  usernameField: 'email',
  passwordField: 'password',
};

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
  done(err, {
    id,
  });
});

// Signup
passport.use(
  'signup',
  new LocalStrategy(fields, (email, password, done) => {
    //Save the information provided by the user to the the database
    const user = {
      Email: faker.internet.email(),
      GivenName: faker.name.firstName(),
      Surname: faker.name.lastName(),
      Groups: ['Manager', 'Project Administrator'],
    };
    //Send the user information to the next middleware
    return done(null, user);
  })
);

// Login
passport.use(
  'login',
  new LocalStrategy(fields, async (email, password, done) => {
    try {
      const email = faker.internet.email();
      return done(
        null,
        {
          iss: 'Online JWT Builder',
          iat: Math.floor(Date.now() / 1000) - 30,
          aud: 'www.example.com',
          sub: email,
          Email: email,
          GivenName: faker.name.firstName(),
          Surname: faker.name.lastName(),
          Groups: ['Manager', 'Project Administrator'],
        },
        {
          message: 'Logged In Successfully',
        }
      );
    } catch (error) {
      return done(error);
    }
  })
);

// JWT
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('jwtSecret'),
    },
    function(jwtPayload, done) {
      const userConf = config.get('user');
      const user = {
        jwt: jwtPayload,
        email: jwtPayload.Email,
        firstName: jwtPayload.GivenName,
        lastName: jwtPayload.Surname,
        name: `${jwtPayload.GivenName} ${jwtPayload.Surname}`,
        groups: jwtPayload.Groups,
        id: jwtPayload[userConf.idField],
      };

      done(null, user);
    }
  )
);

module.exports = passport;
