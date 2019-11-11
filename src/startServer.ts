import "reflect-metadata";
import { config } from "dotenv";
import * as session from "express-session";
import * as connectRedis from "connect-redis";
import { GraphQLServer } from "graphql-yoga";
import { redis } from "./utils/redis";
import { genSchema } from "./utils/genSchema";
import { createTypeormConn } from "./utils/createTypeormConn";
import { confirmEmail } from "./routes/confirmEmail";

config();

const SESSION_SECRET = process.env.SESSION_SECRET;
const RedisStore = connectRedis(session);

export const startServer = async () => {
    const server = new GraphQLServer({
        schema: genSchema() as any,
        context: ({ request }) => ({
            redis,
            url: request.protocol + "://" + request.get("host"),
            session: request.session
        })
    });

    server.express.use(
        session({
            store: new RedisStore({ client: redis as any }),
            name: "quid",
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

    await createTypeormConn();
    const app = await server.start({
        cors,
        port: process.env.NODE_ENV === "test" ? 0 : 4000
    });
    console.log("Server is running on localhost:4000");

    return app;
};
