import * as bcrypt from "bcrypt";
import { ResolversMap } from "../../../types/graphql-utils";
import { User } from "../../../entity/User";

const errorResponse = [
    {
        path: "email",
        message: "Your email or password is invalid."
    }
];

export const resolvers: ResolversMap = {
    Query: {
        bye: (_: any, { name }: any) => `Bye ${name || "Peep"}`
    },
    Mutation: {
        login: async (_, { email, password }, { session }) => {
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return errorResponse;
            } else if (!user.confirmed) {
                return [
                    {
                        path: "email",
                        message: "Please confirm your email address"
                    }
                ];
            }

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                return errorResponse;
            }

            session.userId = user.id;

            return null;
        }
    }
};
