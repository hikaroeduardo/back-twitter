import { prisma } from "../utils/prisma";
import { getPublicURL } from "../utils/url";

export const findTweet = async (id: number) => {
    const tweet = await prisma.tweet.findFirst({
        where: { id },
        include: {
            user: {
                select: {
                    name: true,
                    avatar: true,
                    slug: true,
                },
            },
            likes: {
                select: {
                    userSlug: true,
                },
            },
        },
    });

    if (tweet) {
        tweet.user.avatar = getPublicURL(tweet.user.avatar);

        return tweet;
    }

    return null;
};
