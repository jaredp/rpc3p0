import { RequestDetails, ZodInject } from './api';

interface User {
    email: string;
}


export function ReqJwtStaff(r: RequestDetails) {
    return ZodInject<User>(() => {
        const token = r.req?.cookies?.['login_token'];

        if (typeof token === 'string') {
            return { email: token };
        }

        throw new Error("unauthenticated user");
    });
}
