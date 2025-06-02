import { HTMLParseAndMyLib } from "./index";
export class TestCases {
    static async test1() {
        const html = `<div class="test" for="input1" placeholder="Enter text">
                        <span>Text content</span>
                        <input type="text" required />
                      </div>`;
        const parser = new HTMLParseAndMyLib();
        parser.set_text(html);
        const code = await parser.parseToString();
        console.log(code);
    }
    static test2() {
        const html = `<main class="container mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold mb-6">Main Content Area</h1>
            <p>Scroll down to see the sticky header in action.</p>
            <div class="h-screen"></div>
            <p>Continue scrolling...</p>
            <div class="h-screen"></div>
        </main>`;
        const parser = new HTMLParseAndMyLib();
        parser.set_text(html);
        parser.parseToString().then((res) => {
            console.log(res);
        });
    }
}
