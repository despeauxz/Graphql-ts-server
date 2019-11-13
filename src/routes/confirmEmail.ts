import { Request, Response } from "express";
import { redis } from "../utils/redis";
import { User } from "../entity/User";

export const confirmEmail = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = await redis.get(id);
    if (userId) {
        await User.update({ id: userId }, { confirmed: true });
        await redis.del(id);
        return res.send("Okay");
    } else {
        return res.send("Invalid");
    }
}