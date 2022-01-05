import { compactapi } from "./api-lib/api";
import { z } from "zod";

let count = 0;

export const GetCount = compactapi('GetCount', r => z.strictObject({
}), async (p) => {
    return count;
});

export const IncrementCount = compactapi("IncrementCount", r => z.strictObject({
    addend: z.number()
}), async (p) => {
    count += p.addend;
});
