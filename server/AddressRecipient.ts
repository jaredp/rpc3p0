import { compactapi } from "./api-lib/api";
import { ReqJwtStaff } from "./ReqJwtStaff";
import { z } from "zod";

export const AddressRecipient = compactapi("AddressRecipient", r => z.strictObject({
    firstName: z.string(),
    lastName: z.string(),
    staff: ReqJwtStaff(r)
}), async (p) => {
    return {
        firstLine: `Dear ${p.firstName} ${p.lastName},`,
        body: `your email address is ${p.staff?.email}`
    };
});
