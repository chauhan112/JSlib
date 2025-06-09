export class Tools {
    commonPart(inps: string[]): string {
        const common = (s1: string, s2: string) => {
            let co = "";
            for (let i = 0; i < s1.length; i++) {
                let ch = s1[i];
                if (s2[i] == ch) co += ch;
                else break;
            }
            return co;
        };
        let com = inps[0];
        for (let s2 of inps.slice(1)) com = common(com, s2);
        return com;
    }
}
