import { compactapi, ReqJwtStaff } from "./api";
import { z } from "zod";

export const AddressRecipient = compactapi("AddressRecipient", r => z.strictObject({
    firstName: z.string(),
    lastName: z.string(),
    staff: ReqJwtStaff(r)
}), async (p) => {
    return `Dear ${p.firstName} ${p.lastName}, your email address is ${p.staff?.email}`;
});
