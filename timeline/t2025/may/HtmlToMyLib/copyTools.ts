export class CopyTools {
    static async copyTextToClipboard(text: string): Promise<boolean> {
        /**
         * Copies the given text to the clipboard.
         *
         * @param text The string to copy.
         * @returns A Promise that resolves to `true` if the text was successfully copied,
         *          or `false` if the copy operation failed (e.g., permissions, browser support).
         */
        if (navigator.clipboard?.writeText) {
            try {
                await navigator.clipboard.writeText(text);
                console.log(
                    "Text copied to clipboard successfully (Navigator API)"
                );
                return true;
            } catch (err) {
                console.error("Failed to copy text using Navigator API: ", err);

                return CopyTools.fallbackCopyToClipboard(text);
            }
        } else {
            console.warn(
                "Navigator clipboard API not available. Using fallback method."
            );
            return CopyTools.fallbackCopyToClipboard(text);
        }
    }

    static fallbackCopyToClipboard(text: string): boolean {
        /**
         * Fallback method for copying text to clipboard using document.execCommand.
         * This method is generally less reliable and should only be used if navigator.clipboard is not available.
         * It requires creating a temporary textarea element.
         *
         * @param text The string to copy.
         * @returns true if successful, false otherwise.
         */
        const textArea = document.createElement("textarea");
        textArea.value = text;

        textArea.style.position = "fixed";
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.width = "2em";
        textArea.style.height = "2em";
        textArea.style.padding = "0";
        textArea.style.border = "none";
        textArea.style.outline = "none";
        textArea.style.boxShadow = "none";
        textArea.style.background = "transparent";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand("copy");
            const msg = successful ? "successful" : "unsuccessful";
            console.log("Fallback: Copying text command was " + msg);
            return successful;
        } catch (err) {
            console.error("Fallback: Oops, unable to copy", err);
            return false;
        } finally {
            document.body.removeChild(textArea);
        }
    }
}
