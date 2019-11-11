import { ResolversMap } from "../../../types/graphql-utils";
import { User } from "../../../entity/User";
import * as yup from "yup";
import { formatYupError } from "../../../utils/formatYupError";
import { createConfirmationEmailLink } from "../../../utils/createConfirmationEmailLink";
import { sendVerifyMailToken } from "../../../utils/sendMail";

const schema = yup.object().shape({
    email: yup
        .string()
        .min(3)
        .max(255)
        .email()
        .required(),
    password: yup
        .string()
        .min(5)
        .max(255)
        .required()
});

export const resolvers: ResolversMap = {
    Query: {
        hello: (_: any, { name }: any) => `Hello ${name || "World"}`
    },
    Mutation: {
        register: async (_, args, { redis, url }) => {
            try {
                await schema.validate(args, { abortEarly: false });
            } catch (error) {
                console.log(error);
                return formatYupError(error);
            }
            const { email, password } = args;
            const userAlreadyExists = await User.findOne({
                where: { email },
                select: ["id"]
            });
            console.log(userAlreadyExists);

            if (userAlreadyExists) {
                return [
                    {
                        path: "email",
                        message: "already exists"
                    }
                ];
            }

            const user = User.create({
                email,
                password
            });

            await user.save();

            if (process.env.NODE_ENV !== "test") {
                await sendVerifyMailToken(
                    email,
                    await createConfirmationEmailLink(url, user.id, redis)
                );
            }

            return null;
        }
    }
};
