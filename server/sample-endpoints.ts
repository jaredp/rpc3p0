import { autoapi, untyped_autoapi } from "./api";
import { z } from "zod";

const HelloParams = z.object({});
autoapi(hello, HelloParams);
export function hello() {
    return "world!";
}

untyped_autoapi(capitalize);
export function capitalize(params: {str: string}): string {
    return params.str.toUpperCase();
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

export const foo = 14;

