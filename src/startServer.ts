import "reflect-metadata";
import { config } from "dotenv";
import { GraphQLServer } from "graphql-yoga";
import { redis } from "./utils/redis";
import { genSchema } from "./utils/genSchema";
import { createTypeormConn } from "./utils/createTypeormConn";
import { confirmEmail } from "./routes/confirmEmail";

config();

export const startServer = async () => {
    const server = new GraphQLServer({
        schema: genSchema() as any,
        context: ({ request }) => ({
            redis,
            url: request.protocol + "://" + request.get("host")
        })
    });

    server.express.get("/confirm/:id", confirmEmail);

    await createTypeormConn();
    const app = await server.start();
    console.log("Server is running on localhost:4000");

    return app;
};
