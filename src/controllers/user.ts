import { Response } from "express";
import { ExtendedRequest } from "../types/extend-request";

import {
    findUserBySlug,
    getUserFollowersCount,
    getUserFollowingCount,
    getUserTweetCount,
} from "../services/user";

export const getUser = async (req: ExtendedRequest, res: Response) => {
    const { slug } = req.params;

    const user = await findUserBySlug(slug);
    if (!user) {
        res.json({ error: "Usuário inexistente." });
        return;
    }

    const followingCount = getUserFollowingCount(user.slug);
    const followersCount = getUserFollowersCount(user.slug);
    const tweetCount = getUserTweetCount(user.slug);

    res.json({ user, followingCount, followersCount, tweetCount });
};
