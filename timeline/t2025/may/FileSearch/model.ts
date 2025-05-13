import git from "isomorphic-git";
import http from "isomorphic-git/http/web";
import LightningFS from "@isomorphic-git/lightning-fs";

export class FileSearchModel {
    private files: string[] = [];
    private readonly lfsWrapper: LightFsWrapper;
    private readonly contentSearcher: ContentSearch;

    constructor(lfsWrapper: LightFsWrapper) {
        this.lfsWrapper = lfsWrapper;
        this.contentSearcher = new ContentSearch();
    }

    set_files(files: string[]) {
        this.files = files;
    }

    async search(
        query: string,
        caseSensitive: boolean = false,
        regex: boolean = false
    ): Promise<{ path: string; line: number }[]> {
        const results: { path: string; line: number }[] = [];
        if (!query) return results;

        for (const filePath of this.files) {
            const content = await this.lfsWrapper.read(filePath);
            this.contentSearcher.set_text(content);
            const [found, lineNumber] = this.contentSearcher.search(
                query,
                caseSensitive,
                regex
            );
            if (found) {
                results.push({ path: filePath, line: lineNumber });
            }
        }
        return results;
    }
}

export class ContentSearch {
    private text: string = "";

    set_text(text: string) {
        this.text = text;
    }

    search(
        query: string,
        caseSensitive: boolean = false,
        regex: boolean = false
    ): [boolean, number] {
        // [found, firstLineNumber (1-based)]
        if (!this.text || !query) {
            return [false, 0];
        }

        let searchText = caseSensitive ? this.text : this.text.toLowerCase();
        let searchQuery = caseSensitive ? query : query.toLowerCase();
        let matchIndex = -1;

        if (regex) {
            const re = new RegExp(query, caseSensitive ? "g" : "gi");
            const match = re.exec(this.text); // Use original text for regex for correct indexing
            if (match) {
                matchIndex = match.index;
            }
        } else {
            matchIndex = searchText.indexOf(searchQuery);
        }

        if (matchIndex !== -1) {
            const lines = this.text.substring(0, matchIndex).split("\n");
            return [true, lines.length];
        }

        return [false, 0];
    }
}

const CORS_PROXY = "https://cors.isomorphic-git.org";

export class IsoGitWrapper {
    private readonly fs: LightningFS;
    private dir: string;

    constructor(lfsWrapper: LightFsWrapper, gitDir: string = "/repo") {
        this.fs = lfsWrapper.fs; // isomorphic-git expects the direct fs object
        this.dir = gitDir;
        lfsWrapper.mkdir(gitDir, true).catch(console.error);
    }
    setDir(dir: string) {
        this.dir = dir;
    }

    async clone(
        url: string,
        depth: number = 1,
        singleBranch: boolean = true,
        ref?: string // e.g. 'main'
    ): Promise<void> {
        try {
            console.log(`Cloning ${url} into ${this.dir}...`);
            await git.clone({
                fs: this.fs,
                http,
                dir: this.dir,
                corsProxy: CORS_PROXY,
                url: url,
                depth: depth,
                singleBranch: singleBranch,
                ref: ref, // if undefined, clones default branch
                onProgress: (progress: any) => {
                    console.log(
                        "Clone progress:",
                        progress.phase,
                        progress.loaded,
                        "/",
                        progress.total
                    );
                },
            });
            console.log("Clone complete.");
        } catch (e) {
            console.error("Clone failed:", e);
            throw e;
        }
    }

    async pull(
        author: { name: string; email: string },
        singleBranch: boolean = true,
        ref?: string // branch name e.g. 'main', 'master'
    ): Promise<void> {
        try {
            console.log(`Pulling for ${this.dir}...`);
            await git.pull({
                fs: this.fs,
                http,
                dir: this.dir,
                corsProxy: CORS_PROXY,
                ref: ref,
                author: author,
                singleBranch: singleBranch,
                onProgress: (progress: any) => {
                    console.log(
                        "Pull progress:",
                        progress.phase,
                        progress.loaded,
                        "/",
                        progress.total
                    );
                },
            });
            console.log("Pull complete.");
        } catch (e) {
            console.error("Pull failed:", e);
            throw e;
        }
    }

    async push(
        remote: string = "origin",
        ref?: string, // branch name
        force: boolean = false,
        onAuth?: (url: string) => {
            username?: string;
            password?: string;
            token?: string;
        } // for private repos
    ): Promise<void> {
        try {
            console.log(
                `Pushing ${ref || "current branch"} to ${remote} from ${
                    this.dir
                }...`
            );
            // For push, you'll often need authentication.
            // isomorphic-git supports onAuth and onAuthFailure callbacks.
            // For simplicity, this example assumes a public repo or pre-configured credentials.
            await git.push({
                fs: this.fs,
                http,
                dir: this.dir,
                corsProxy: CORS_PROXY,
                remote: remote,
                ref: ref,
                force: force,
                onAuth: onAuth
                    ? (url: string) => {
                          const auth = onAuth(url);
                          return {
                              username: auth.username,
                              password: auth.password || auth.token,
                          };
                      }
                    : undefined,
                onProgress: (progress: any) => {
                    console.log(
                        "Push progress:",
                        progress.phase,
                        progress.loaded,
                        "/",
                        progress.total
                    );
                },
            });
            console.log("Push complete.");
        } catch (e) {
            console.error("Push failed:", e);
            throw e;
        }
    }

    async commit(
        message: string,
        author: { name: string; email: string }
    ): Promise<string | undefined> {
        // Returns commit SHA
        try {
            const sha = await git.commit({
                fs: this.fs,
                dir: this.dir,
                message: message,
                author: author,
            });
            return sha;
        } catch (e) {
            console.error("Commit failed:", e);
            throw e;
        }
    }

    async add(filepath: string | string[]): Promise<void> {
        try {
            const filesToAdd = Array.isArray(filepath) ? filepath : [filepath];
            for (const file of filesToAdd) {
                await git.add({
                    fs: this.fs,
                    dir: this.dir,
                    filepath: file.startsWith("/")
                        ? file.substring(this.dir.length + 1)
                        : file, // relative to this.dir
                });
            }
            console.log("Add complete for:", filesToAdd.join(", "));
        } catch (e) {
            console.error("Add failed for", filepath, ":", e);
            throw e;
        }
    }

    async status(filepath?: string): Promise<any> {
        // Returns status or status matrix
        try {
            if (filepath) {
                return await git.status({
                    fs: this.fs,
                    dir: this.dir,
                    filepath,
                });
            }
            // For all files (statusMatrix)
            const matrix = await git.statusMatrix({
                fs: this.fs,
                dir: this.dir,
            });
            console.log("Status Matrix:", matrix);
            return matrix;
        } catch (e) {
            console.error("Status failed:", e);
            throw e;
        }
    }
}
export class LightFsWrapper {
    fs: LightningFS;
    pfs: LightningFS.PromisifiedFS;
    constructor(name: string = "my-filesystem") {
        this.fs = new LightningFS(name);
        this.pfs = this.fs.promises;
    }

    async dirlist(path: string, walk: boolean): Promise<string[]> {
        const dirents = await this.pfs.readdir(path);
        const results: string[] = [];

        for (const dirent of dirents) {
            const fullPath = `${
                path.endsWith("/") ? path : path + "/"
            }${dirent}`;
            results.push(fullPath);
            if (walk && (await this.isDir(fullPath))) {
                results.push(...(await this.dirlist(fullPath, true)));
            }
        }
        return results;
    }
    async read(path: string): Promise<string> {
        try {
            const content = await this.pfs.readFile(path, "utf8");
            return content;
        } catch (e) {
            console.error(`Error reading file ${path}:`, e);
            return "";
        }
    }

    async write(path: string, content: string): Promise<void> {
        try {
            const dirPath = path.substring(0, path.lastIndexOf("/"));
            if (dirPath && !(await this.exists(dirPath))) {
                await this.mkdir(dirPath, true); // recursive mkdir
            }
            await this.pfs.writeFile(path, content, "utf8");
        } catch (e) {
            console.error(`Error writing file ${path}:`, e);
        }
    }

    async delete(path: string, recursive: boolean = false): Promise<void> {
        try {
            if (await this.isFile(path)) {
                await this.pfs.unlink(path);
            } else if (await this.isDir(path)) {
                if (recursive) {
                    const items = await this.pfs.readdir(path);
                    for (const item of items) {
                        await this.delete(`${path}/${item}`, true);
                    }
                }
                await this.pfs.rmdir(path); // rmdir only works on empty dirs
            }
        } catch (e) {
            console.error(`Error deleting ${path}:`, e);
        }
    }

    async exists(path: string): Promise<boolean> {
        try {
            await this.pfs.stat(path);
            return true;
        } catch (e) {
            return false; // Typically "ENOENT" error
        }
    }

    async isFile(path: string): Promise<boolean> {
        try {
            const stat = await this.pfs.stat(path);
            return stat.isFile();
        } catch (e) {
            // console.error(`Error checking if ${path} is a file:`, e);
            return false;
        }
    }

    async isDir(path: string): Promise<boolean> {
        try {
            const stat = await this.pfs.stat(path);
            return stat.isDirectory();
        } catch (e) {
            return false;
        }
    }

    async listfiles(path: string, walk: boolean = false): Promise<string[]> {
        const dirs = await this.dirlist(path, walk);
        const filePromises = dirs.map(async (dir) => ({
            dir,
            isFile: await this.isFile(dir),
        }));
        const files = await Promise.all(filePromises);
        return files.filter((file) => file.isFile).map((file) => file.dir);
    }
    async listfilesWithIgnore(
        baseDir: string,
        ignoreFolders: string[]
    ): Promise<string[]> {
        const allFiles = [];
        const queue = [""]; // Start with relative path root

        while (queue.length > 0) {
            const currentRelativeDir = queue.shift();
            const currentFullDir = currentRelativeDir
                ? `${baseDir}/${currentRelativeDir}`
                : baseDir;

            const entries = await this.pfs.readdir(currentFullDir);

            for (const entry of entries) {
                if (ignoreFolders.some((folder) => entry.startsWith(folder))) {
                    continue;
                }

                const entryRelativePath = currentRelativeDir
                    ? `${currentRelativeDir}/${entry}`
                    : entry;
                const entryFullPath = `${baseDir}/${entryRelativePath}`;
                const stats = await this.pfs.stat(entryFullPath);

                if (stats.isFile()) {
                    allFiles.push(entryRelativePath);
                } else if (stats.isDirectory()) {
                    queue.push(entryRelativePath); // Add directory to queue for processing
                }
            }
        }
        return allFiles;
    }
    async mkdir(path: string, recursive: boolean = false): Promise<void> {
        // LightningFS mkdir is not recursive by default in its promisified version's types
        // but the underlying implementation might support it.
        // For safety, we implement recursive manually if needed.
        if (recursive) {
            const parts = path.split("/").filter((p) => p);
            let currentPath = "";
            for (const part of parts) {
                currentPath += (currentPath === "" ? "" : "/") + part;
                if (!(await this.exists("/" + currentPath))) {
                    try {
                        await this.pfs.mkdir("/" + currentPath);
                    } catch (e) {
                        // It might fail if a parallel operation created it. Check again.
                        if (!(await this.exists("/" + currentPath))) {
                            console.error(
                                `Error creating directory /${currentPath}:`,
                                e
                            );
                            throw e; // rethrow if it truly failed
                        }
                    }
                }
            }
        } else {
            try {
                await this.pfs.mkdir(path);
            } catch (e) {
                console.error(`Error creating directory ${path}:`, e);
            }
        }
    }
}

export class LightFsWrapperTest {
    create() {
        const fs = new LightFsWrapper("test-fs");
        fs.dirlist("/", true).then((dirs) => {
            console.log("Directories:", dirs);
        });
        fs.mkdir("testdir").then(() => {
            console.log("Directory created");
        });
        fs.write("/testdir/testfile.txt", "Hello, world!").then(() => {
            console.log("File written");
        });
        fs.read("/testdir/testfile.txt").then((data) => {
            console.log("File read:", data);
        });
        fs.delete("/testdir", true).then(() => {
            console.log("File deleted");
        });
    }
}
