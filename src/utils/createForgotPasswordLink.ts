import { v4 } from "uuid";
import { Redis } from "ioredis";

export const createForgotPasswordLink = async (
    url: string,
    userId: string,
    redis: Redis
) => {
    const id = v4();
    await redis.set(`forgot:${id}`, userId, "ex", 60 * 30);
    return `${url}/forgot_password/${id}`;
};
