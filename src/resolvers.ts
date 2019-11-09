import { ResolversMap } from "./types/graphql-utils";
import { User } from "./entity/User";
import * as yup from "yup";
import { formatYupError } from './utils/formatYupError';

let schema = yup.object().shape({
    email: yup
        .string()
        .max(255)
        .email()
        .required(),
    password: yup
        .string()
        .max(255)
        .required()
});

export const resolvers: ResolversMap = {
    Query: {
        hello: (_: any, { name }: any) => `Hello ${name || "World"}`
    },
    Mutation: {
        register: async (_, args) => {
            try {
                await schema.validate(args, { abortEarly: false });
                return false;
            } catch (error) {
                console.log(error);
                return formatYupError(error);
            }
            const { email, password } = args;
            const userAlreadyExists = User.findOne({
                where: { email },
                select: ["id"]
            });

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
            return null;
        }
    }
};
