import { readFileSync } from 'fs';

export function loadCode(name: string) {
    const code = readFileSync(
        `data/code/${name}.pre`,
        { encoding: 'utf-8' }
    )
    return code;
}
