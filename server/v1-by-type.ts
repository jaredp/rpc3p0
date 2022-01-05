import { untyped_autoapi } from "./api-lib/api";

untyped_autoapi(capitalize);
export async function capitalize(params: { str: string; }): Promise<string> {
    console.log("running on the server!", params.str);
    return `From the server: ${params.str.toUpperCase()}`;
}
