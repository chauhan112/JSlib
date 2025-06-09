// npm install --save-dev dependency-cruiser fs-extra
import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";

export async function extractDependencies(
    entry_point = "./src/main.ts",
    lib_loc = "./src/rlib",
    output_dir = "./src/orlib"
) {
    await fs.remove(output_dir);
    await fs.ensureDir(output_dir);

    let module_rel_path = path.relative(path.dirname(entry_point), lib_loc);

    const command = `npx depcruise --include-only "${module_rel_path}" --output-type json ${entry_point} --no-config`;

    let depJson;
    try {
        depJson = execSync(command, { encoding: "utf8" });
    } catch (e) {
        depJson = e.stdout;
    }

    const depGraph = JSON.parse(depJson);
    const filesToCopy = new Set();

    depGraph.modules.forEach((module) => {
        if (!module.coreModule && !module.couldNotResolve) {
            filesToCopy.add(module.source);
        }
    });

    let path_normalized = path.normalize(lib_loc);
    for (const filePath of filesToCopy) {
        let fpn = path.normalize(filePath).slice(path_normalized.length);
        let destPath = path.join(output_dir, fpn);
        console.log(fpn);
        console.log(`  -> Copying ${filePath} to ${destPath}`);
        await fs.copy(filePath, destPath, {
            // Ensure the destination directory exists
            overwrite: true,
            errorOnExist: false,
            preserveTimestamps: true,
        });
    }

    console.log("\n✅ Extraction complete!");
    console.log(`Your minimal library is now in "${output_dir}".`);
    console.log(
        "You can now point your imports to this new directory and build your project."
    );
}
