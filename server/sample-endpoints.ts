
export function hello() {
    return "world!";
}

interface MoreComplicatedParams {
    n: number;
}

export async function moreComplicated(params: MoreComplicatedParams) {
    const { n } = params;
    
    await new Promise<void>((resolve) => setTimeout((() => resolve()), 1000));
    return n + 10;
}
