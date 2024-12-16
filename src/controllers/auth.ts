import { Request, Response } from "express";
import slug from "slug";
import { hash } from "bcrypt-ts";

import { signupSchema } from "../schemas/signup";
import { createUser, findUserByEmail, findUserBySlug } from "../services/user";
import { createJWT } from "../utils/jwt";

export const signup = async (req: Request, res: Response) => {
    // safeParse não lança erro quando a validação falhar (O método ".parse" lança um erro)
    // contém um objeto com success e erro

    const safeData = signupSchema.safeParse(req.body);
    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors });
        return;
    }

    const hasEmail = await findUserByEmail(safeData.data.email);
    if (hasEmail) {
        res.json({
            error: "E-mail já existe.",
        });
        return;
    }

    let genSlug = true;
    let userSlug = slug(safeData.data.name);

    while (genSlug) {
        const hasSlug = await findUserBySlug(userSlug);
        if (hasSlug) {
            const slugSuffix = Math.floor(Math.random() * 999999).toString();
            userSlug = slug(safeData.data.name + slugSuffix);
        } else {
            genSlug = false;
        }
    }

    const hashPassword = await hash(safeData.data.password, 10);

    const newUser = await createUser({
        slug: userSlug,
        name: safeData.data.name,
        email: safeData.data.email,
        password: hashPassword,
    });

    const token = createJWT(userSlug);

    res.status(201).json({
        token,
        user: {
            name: newUser.name,
            slug: newUser.slug,
            avatar: newUser.avatar,
        },
    });
};
