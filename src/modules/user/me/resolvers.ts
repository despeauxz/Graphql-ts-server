import { ResolversMap } from "../../../types/graphql-utils";
import { User } from "../../../entity/User";

export const resolvers: ResolversMap = {
    Query: {
        me: (_, __, { session }) => User.findOne({ where: { id: session.userId } })
    }
}