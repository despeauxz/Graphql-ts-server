import { Redis } from "ioredis";

export interface Context {
    redis: Redis;
    url: string;
    session: Session;
    req: Express.Request;
}

export interface Session extends Express.Session {
    userId?: string;
}

export type Resolver = (
    parent: any,
    args: any,
    context: Context,
    info: any
) => any;

export type GraphQLMiddleware = (
    resolver: Resolver,
    parent: any,
    args: any,
    context: Context,
    info: any
) => any;

export interface ResolversMap {
    [key: string]: {
        [key: string]: Resolver;
    };
}

export interface Mailer {
    to: string;
    subject: string;
    message: string;
}

export interface StrategyOptions {
    /**
     * Your Google application's client id.
     */
    clientID: string;

    /**
     * Your Google application's client secret.
     */
    clientSecret: string;

    /**
     * URL to which Google will redirect the user after granting authorization.
     */
    callbackURL: string;
}
