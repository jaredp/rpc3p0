import { compactapi } from "./api-lib/api";
import { z } from "zod";

export const ReactSSR = compactapi("ReactSSR", r => z.strictObject({
}), async (p) => {
    return {
        hello: 'world!',
        elems: (<div style={{border: '1px solid black'}} className="foo bar" />).props
    };
});
