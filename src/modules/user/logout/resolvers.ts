import { ResolversMap } from "../../../types/graphql-utils";

export const resolvers: ResolversMap = {
    Query: {
        dummy: () => "Dummy"
    },
    Mutation: {
        logout: async (_, __, { session, redis }) => {
            const { userId } = session;
            if (userId) {
                const sessionIds = await redis.lrange(
                    `userSids:${userId}`,
                    0,
                    -1
                );
                
                const promises = [];
                // tslint:disable-next-line: prefer-for-of
                for (let i = 0; i < sessionIds.length; i++) {
                    promises.push(redis.del(`sess:${sessionIds[i]}`));
                }
                await Promise.all(promises);

                return true;
            }

            return false;
        }
    }
};
