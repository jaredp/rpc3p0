import { strictcompactapi, autoapi, untyped_autoapi } from "./api";
import { z } from "zod";


untyped_autoapi(capitalize);
export async function capitalize(params: {str: string}): Promise<string> {
    return params.str.toUpperCase();
}


const HelloParams = z.object({});
autoapi(hello, HelloParams);
export function hello() {
    return "world!";
}

const MoreComplicatedParams = z.object({
    n: z.number()
})

autoapi(moreComplicated, MoreComplicatedParams);
export async function moreComplicated(params: z.infer<typeof MoreComplicatedParams>) {
    const { n } = params;

    await new Promise<void>((resolve) => setTimeout((() => resolve()), 1000));
    return {add: n + 10, mul: n * 5};
}


export const SayHello = strictcompactapi("SayHello", z.strictObject({
    firstName: z.string(),
    lastName: z.string(),
}), async (p) => {
    return `Dear ${p.firstName} ${p.lastName}`;
})



