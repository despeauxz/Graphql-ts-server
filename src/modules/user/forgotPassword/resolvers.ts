import * as yup from "yup";
import * as bcrypt from "bcrypt";
import { ResolversMap } from "../../../types/graphql-utils";
import { User } from "../../../entity/User";
import { formatYupError } from "../../../utils/formatYupError";
import { sendForgotPasswordMail } from "../../../utils/sendMail";
import { createForgotPasswordLink } from "../../../utils/createForgotPasswordLink";

const schema = yup.object().shape({
    password: yup
        .string()
        .min(5)
        .max(255)
        .required()
});

export const resolvers: ResolversMap = {
    Query: {
        dummy2: () => "Dummy two"
    },
    Mutation: {
        sendForgotPasswordMail: async (_, { email }, { redis }) => {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return [
                    {
                        path: "email",
                        message: "Could not find user with that email"
                    }
                ];
            }

            await sendForgotPasswordMail(
                email,
                await createForgotPasswordLink(process.env.FRONTEND_URL as string, user.id, redis)
            );

            return null;
        },
        forgotPasswordChange: async (_, { newPassword, key }, { redis }) => {
            const redisKey = `forgot:${key}`;
            const userId = await redis.get(redisKey);

            if (!userId) {
                return [
                    {
                        path: "key",
                        message: "Key has expired"
                    }
                ];
            }

            try {
                await schema.validate({ newPassword }, { abortEarly: false });
            } catch (error) {
                return formatYupError(error);
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const updatePromise = User.update({ id: userId }, { password: hashedPassword });
            const deleteKey = redis.del(redisKey);

            await Promise.all([updatePromise, deleteKey]);

            return null;
        }
    }
};
