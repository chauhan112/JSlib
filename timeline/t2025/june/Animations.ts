// npm install motion
import { animate, stagger } from "motion";
import { Tools } from "../april/tools";
export const SimpleAnimationExample = () => {
    let comp = Tools.div({
        class: " p-8 rounded-xl shadow-lg cursor-pointer transform-gpu",
        child: Tools.comp("p", {
            class: "text-2xl font-bold inline-block",
            textContent: "Click me for an animation!",
        }),
    });
    comp.update(
        {},
        {
            click: () => {
                animate(
                    // We can pass the element variable directly for better performance and safety
                    comp.getElement(),
                    {
                        scale: [0.9, 1.1, 1], // Keyframes: shrink, grow, back to normal
                        rotate: [0, -2, 2, 0], // Wiggle effect
                    },
                    {
                        duration: 0.5,
                        easing: "ease-in-out",
                    }
                );
            },
        }
    );
    return Tools.div({ class: "flex justify-center", children: [comp] });
};

export const AnimateBoxes = () => {
    const comp = Tools.comp("div", {
        class: "w-[60%] grid grid-cols-5 gap-4",
        children: [
            Tools.comp("div", {
                class: "stagger-box w-full h-20 bg-indigo-500 rounded-lg",
            }),
            Tools.comp("div", {
                class: "stagger-box w-full h-20 bg-indigo-500 rounded-lg",
            }),
            Tools.comp("div", {
                class: "stagger-box w-full h-20 bg-indigo-500 rounded-lg",
            }),
            Tools.comp("div", {
                class: "stagger-box w-full h-20 bg-indigo-500 rounded-lg",
            }),
            Tools.comp("div", {
                class: "stagger-box w-full h-20 bg-indigo-500 rounded-lg",
            }),
        ],
    });
    let animated = false;
    return Tools.div({
        children: [
            Tools.comp(
                "button",
                {
                    class: "bg-indigo-500 text-white py-2 px-4 rounded-lg cursor-pointer on hover:bg-indigo-600 mb-12",
                    textContent: "Animate boxes",
                },
                {
                    click: () => {
                        if (!animated) {
                            animate(
                                ".stagger-box",
                                { y: [0, -20, 0] }, // Keyframes: move up and back down
                                {
                                    delay: stagger(0.1, { from: "first" }), // Each element starts 0.1s after the previous one
                                    duration: 1.5,
                                    repeat: Infinity,
                                    easing: "ease-in-out",
                                }
                            );
                            animated = true;
                            console.log("Animation started");
                        }
                    },
                }
            ),
            comp,
        ],
    });
};
