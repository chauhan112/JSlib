export class StringTool {
    static strip(str: string, charsToRemove: string = "") {
        if (charsToRemove === "") {
            return String(str).trim();
        }
        let s = String(str);
        let start = 0;
        let end = s.length;
        while (start < end && charsToRemove.includes(s[start])) {
            start++;
        }
        while (end > start && charsToRemove.includes(s[end - 1])) {
            end--;
        }
        return s.substring(start, end);
    }

    static lstrip(str: string, charsToRemove: string) {
        if (charsToRemove === "") {
            return String(str).trimStart();
        }
        let s = String(str);
        let start = 0;
        while (start < s.length && charsToRemove.includes(s[start])) {
            start++;
        }
        return s.substring(start);
    }

    static rstrip(str: string, charsToRemove: string) {
        if (charsToRemove === "") {
            return String(str).trimEnd();
        }
        let s = String(str);
        let end = s.length;
        while (end > 0 && charsToRemove.includes(s[end - 1])) {
            end--;
        }
        return s.substring(0, end);
    }
}

export class FileTools {
    static getFileName(filePath: string) {
        return filePath.substring(filePath.lastIndexOf("/") + 1);
    }
    static getExtension(filePath: string) {
        return filePath.substring(filePath.lastIndexOf(".") + 1);
    }
}
export class GitTools {
    static validateAndParseGitHubUrl(urlInput: string) {
        const githubHttpsRegex =
            /^https:\/\/github\.com\/([a-zA-Z0-9-]+\/[a-zA-Z0-9.-]+)\.git$/;

        if (typeof urlInput !== "string") {
            return null;
        }

        const match = githubHttpsRegex.exec(urlInput);

        if (match === null) {
            return null;
        } else {
            const fullUrl = match[0];
            const projectName = match[1];

            return {
                url: fullUrl,
                projectName: projectName,
            };
        }
    }
}
