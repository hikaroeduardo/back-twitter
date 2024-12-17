import { Response } from "express";

import {
    checkIfTweetLikedByUser,
    createTweet,
    findAnswersFromTweet,
    findTweet,
    likeTweet,
    unlikeTweet,
} from "../services/tweet";
import { addHastag } from "../services/trend";

import { addTweetSchema } from "../schemas/add-tweet";
import { ExtendedRequest } from "../types/extend-request";

export const addTweet = async (req: ExtendedRequest, res: Response) => {
    const safeData = addTweetSchema.safeParse(req.body);
    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors });
        return;
    }

    if (safeData.data.answer) {
        const hasAnswerTweet = await findTweet(parseInt(safeData.data.answer));
        if (!hasAnswerTweet) {
            res.json({ error: "Tweet original inexistente." });
            return;
        }
    }

    const newTweet = await createTweet(
        req.userSlug as string,
        safeData.data.body,
        safeData.data.answer ? parseInt(safeData.data.answer) : 0
    );

    const hastags = safeData.data.body.match(/#[a-zA-Z0-9_]+/g);
    if (hastags) {
        for (let hastag of hastags) {
            if (hastag.length >= 2) {
                await addHastag(hastag);
            }
        }
    }

    res.json({ tweet: newTweet });
};

export const getTweet = async (req: ExtendedRequest, res: Response) => {
    const { id } = req.params;

    const tweet = await findTweet(parseInt(id));
    if (!tweet) {
        res.json({ error: "Tweet inexistente." });
        return;
    }

    res.json({ tweet });
};

export const getAnswers = async (req: ExtendedRequest, res: Response) => {
    const { id } = req.params;

    const answer = await findAnswersFromTweet(parseInt(id));

    res.json({ answer });
};

export const likeToggle = async (req: ExtendedRequest, res: Response) => {
    const { id } = req.params;

    const liked = await checkIfTweetLikedByUser(
        req.userSlug as string,
        parseInt(id)
    );
    if (liked) {
        unlikeTweet(req.userSlug as string, parseInt(id));
    } else {
        likeTweet(req.userSlug as string, parseInt(id));
    }

    res.json({});
};
