import { api, autoapi } from "./api";

autoapi(hello);
export function hello() {
    return "world!";
}


interface MoreComplicatedParams {
    n: number;
}

autoapi(moreComplicated);
export async function moreComplicated(params: MoreComplicatedParams) {
    const { n } = params;

    await new Promise<void>((resolve) => setTimeout((() => resolve()), 1000));
    return {add: n + 10, mul: n * 5};
}

export const foo = 14;

