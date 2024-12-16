import { prisma } from "../utils/prisma";

export const addHastag = async (hastag: string) => {
    const hs = await prisma.trend.findFirst({
        where: { hastag },
    });
    if (hs) {
        await prisma.trend.update({
            where: { id: hs.id },
            data: {
                counter: hs.counter + 1,
                updatedAt: new Date(),
            },
        });
    } else {
        await prisma.trend.create({
            data: { hastag },
        });
    }
};
