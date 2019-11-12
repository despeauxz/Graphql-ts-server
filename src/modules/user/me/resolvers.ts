import { ResolversMap } from "../../../types/graphql-utils";
import { User } from "../../../entity/User";
import { createMiddleware } from "../../../utils/createMiddleware";
import middleware from "./middleware";

export const resolvers: ResolversMap = {
    Query: {
        me: createMiddleware(middleware, (_, __, { session }) => User.findOne({ where: { id: session.userId } }))
    }
}