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

export const checkIfTweetLikedByUser = async (slug: string, id: number) => {
    const isLiked = await prisma.tweetLike.findFirst({
        where: {
            userSlug: slug,
            tweetId: id,
        },
    });

    return isLiked ? true : false;
};

export const unlikeTweet = async (slug: string, id: number) => {
    await prisma.tweetLike.deleteMany({
        where: {
            userSlug: slug,
            tweetId: id,
        },
    });
};

export const likeTweet = async (slug: string, id: number) => {
    await prisma.tweetLike.create({
        data: {
            userSlug: slug,
            tweetId: id,
        },
    });
};

export const findTweetsByUser = async (
    slug: string,
    currentPage: number,
    perPage: number
) => {
    const tweets = await prisma.tweet.findMany({
        where: { userSlug: slug, answerOf: 0 },
        orderBy: { createdAt: "desc" },
        skip: currentPage * perPage,
        take: perPage,
        include: {
            likes: {
                select: {
                    userSlug: true,
                },
            },
        },
    });

    return tweets;
};

export const findTweetFeed = async (
    following: string[],
    currentPage: number,
    perPage: number
) => {
    const tweets = await prisma.tweet.findMany({
        where: {
            userSlug: { in: following },
            answerOf: 0,
        },
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
        orderBy: { createdAt: "desc" },
        skip: currentPage * perPage,
        take: perPage,
    });

    for (let tweetindex in tweets) {
        tweets[tweetindex].user.avatar = getPublicURL(
            tweets[tweetindex].user.avatar
        );
    }

    return tweets;
};

export const findTweetsByBody = async (
    bodyContains: string,
    currentPage: number,
    perPage: number
) => {
    const tweets = await prisma.tweet.findMany({
        where: {
            body: {
                contains: bodyContains,
                mode: "insensitive",
            },
            answerOf: 0,
        },
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
        orderBy: { createdAt: "desc" },
        skip: currentPage * perPage,
        take: perPage,
    });

    for (let tweetindex in tweets) {
        tweets[tweetindex].user.avatar = getPublicURL(
            tweets[tweetindex].user.avatar
        );
    }

    return tweets;
};
