import { Response } from "express";

import { createTweet, findTweet } from "../services/tweet";
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

    const hastags = safeData.data.body.match(/#[a-zA-Z0-9_]/g);
    if (hastags) {
        for (let hastag of hastags) {
            if (hastag.length >= 2) {
                await addHastag(hastag);
            }
        }
    }

    res.json({ tweet: newTweet });
};
