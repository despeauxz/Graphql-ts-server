import { ResolversMap } from "../../../types/graphql-utils";

export const resolvers: ResolversMap = {
    Query: {
        dummy2: () => "Dummy two"
    },
    Mutation: {
        sendForgotPasswordMail: (_, {  }, { redis }) => {

        },
        forgotPasswordChange: (_, {  }) => {

        }
    }
}