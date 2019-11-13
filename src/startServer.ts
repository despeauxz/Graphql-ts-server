import "reflect-metadata";
import { config } from "dotenv";
import * as session from "express-session";
import * as connectRedis from "connect-redis";
import { GraphQLServer } from "graphql-yoga";
// import * as RateLimit from "express-rate-limit";
// import * as RateLimitRedisStore from "rate-limit-redis";
import * as passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { redis } from "./utils/redis";
import { genSchema } from "./utils/genSchema";
import { createTypeormConn } from "./utils/createTypeormConn";
import { confirmEmail } from "./routes/confirmEmail";
import { User } from "./entity/User";

config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
const SESSION_SECRET = process.env.SESSION_SECRET as string;
const RedisStore = connectRedis(session);

export const startServer = async () => {
    const server = new GraphQLServer({
        schema: genSchema() as any,
        context: ({ request }) => ({
            redis,
            url: request.protocol + "://" + request.get("host"),
            session: request.session,
            req: request
        })
    });

    // server.express.use(
    //     new RateLimit({
    //       store: new RateLimitRedisStore({}),
    //       windowMs: 15 * 60 * 1000, // 15 minutes
    //       max: 100, // limit each IP to 100 requests per windowMs
    //     })
    // );

    server.express.use(
        session({
            store: new RedisStore({ client: redis as any, prefix: "sess:" }),
            name: "qid",
            secret: `${SESSION_SECRET}`,
            resave: false,
            saveUninitialized: true,
            cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 1000 * 60 * 60 * 12
            }
        })
    );

    const cors = {
        credentails: true,
        origin:
            process.env.NODE_ENV === "test"
                ? "*"
                : (process.env.FRONTEND_URL as string)
    };

    server.express.get("/confirm/:id", confirmEmail);

    const connection = await createTypeormConn();
    // await createTypeormConn();

    passport.use(
        new GoogleStrategy(
            {
                clientID: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
                callbackURL: "http://localhost:4000/auth/google/callback"
            },
            async (_, __, profile, done) => {
                console.log(profile);
                const { id, emails } = profile;
                const query = await connection
                    .getRepository(User)
                    .createQueryBuilder("user")
                    .where("user.twitterId = :id", { id });

                let email: string | undefined;
                if (emails) {
                    email = emails[0].value;
                    await query.orWhere("user.email = :email", { email });
                }

                let user = await query.getOne();
                if (!user) {
                    user = await User.create({
                        googleId: id,
                        email,
                        confirmed: true
                    }).save();
                } else if (!user.googleId) {
                    user.googleId = id;
                    await user.save();
                } else {
                    // eklrjm3jkw
                }

                return done(_, user.id);
            }
        )
    );

    server.express.use(passport.initialize());
    server.express.get(
        "/auth/google",
        passport.authenticate("google", {
            scope: [
                "https://www.googleapis.com/auth/userinfo.profile",
                "https://www.googleapis.com/auth/userinfo.email"
            ]
        })
    );

    server.express.get(
        "/auth/google/callback",
        passport.authenticate("google", {
            failureRedirect: "/login",
            session: false
        }),
        (req, res) => {
            (req.session as any).userId = (req.user as any).userId;
            res.redirect("/");
        }
    );

    const app = await server.start({
        cors,
        port: process.env.NODE_ENV === "test" ? 0 : 4000
    });
    console.log("Server is running on localhost:4000");

    return app;
};
