import path from 'path';

const root_dir = process.cwd();
export interface StackFrame {
    file: string;
    line?: number;
    column?: number;
}
;
export function getStack(): (StackFrame | null)[] {
    return (new Error("").stack ?? "")
        .split('\n')
        .slice(2)
        .map(line => {
            // error stack lines are formatted like
            //  at compactapi (/Users/jaredpochtar/Desktop/rpc3p0/server/api.ts:113:19)
            const in_parens = line.match(/\(([^)]+)\)/)?.[1];
            if (!in_parens) {
                return null;
            }
            const [file, line_str, col_str] = in_parens.split(':');
            return {
                file: path.relative(root_dir, file),
                line: Number(line_str),
                column: Number(col_str)
            };
        });
}
