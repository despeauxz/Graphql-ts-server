import { Redis } from "ioredis";

export interface Context {
    redis: Redis;
    url: string;
    session: Session;
}

export interface Session {
    userId?: string
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
