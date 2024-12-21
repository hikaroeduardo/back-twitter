import { Response } from "express";
import { ExtendedRequest } from "../types/extend-request";

import { getUserFollowing } from "../services/user";
import { findTweetFeed } from "../services/tweet";

import { feedSchema } from "../schemas/feed";

export const getFeed = async (req: ExtendedRequest, res: Response) => {
    const safeData = feedSchema.safeParse(req.body);
    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors });
        return;
    }

    let perPage = 2;
    let currentPage = safeData.data.page ?? 0;

    const following = await getUserFollowing(req.userSlug as string);

    const tweets = await findTweetFeed(following, currentPage, perPage);

    res.json({ tweets, page: currentPage });
};
