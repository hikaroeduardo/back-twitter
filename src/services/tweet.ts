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

export const createTweet = async (
    slug: string,
    body: string,
    answer?: number
) => {
    const newTweet = await prisma.tweet.create({
        data: {
            body,
            userSlug: slug,
            answerOf: answer ?? 0,
        },
    });

    return newTweet;
};

export const findAnswersFromTweet = async (id: number) => {
    const tweets = await prisma.tweet.findMany({
        where: { answerOf: id },
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

    for (let tweetIndex in tweets) {
        tweets[tweetIndex].user.avatar = getPublicURL(
            tweets[tweetIndex].user.avatar
        );
    }

    return tweets;
};
