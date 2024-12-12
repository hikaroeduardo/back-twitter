// PrismaClient permite que a gente se conecte ao banco de dados e faça queries
import { PrismaClient } from "@prisma/client";

/*
    - globalThis -> Funciona em qualquer ambiente (Navegador ou servidor)
        . Salvamos a variável em escopo global, ou seja, pode ser acessada em qualquer lugar do programa, ou seja, fica disponível em       qualquer lugar da aplicação, sem precisar recriar sempre.
        . Evita recriar a conexão em cada solicitação
        
    - unknown é utilizado quando não sabemos qual é o tipo no momento, sabemos que existe algo, mas não o tipo.
*/
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
