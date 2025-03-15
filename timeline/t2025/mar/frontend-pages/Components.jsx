import {
    useState,
    forwardRef,
    useImperativeHandle,
    useRef,
    useEffect,
} from "react";

export const Components = forwardRef((props, ref) => {
    const [count, setCount] = useState(0);
    const [st, setSt] = useState({ ...props });
    useImperativeHandle(ref, () => ({
        s: { count, setCount, st, setSt },
    }));

    return <div {...st}>Count: {count}</div>;
});

export const Button = forwardRef((props, ref) => {
    const [st, setSt] = useState({ ...props });
    useImperativeHandle(ref, () => ({
        s: { st, setSt },
    }));

    return <button {...st} />;
});

export const Input = forwardRef((props, ref) => {
    const [st, setSt] = useState({ ...props });
    useImperativeHandle(ref, () => ({
        s: { st, setSt },
    }));

    return <input {...st} />;
});

const Title = forwardRef((props, ref) => {
    const [st, setSt] = useState({
        className: "text-2xl font-bold text-[rgb(50,19,95)] select-none",
        ...props,
    });
    useImperativeHandle(ref, () => ({ st, setSt }));
    return <div {...st}>{st.label}</div>;
});
export const H1Title = forwardRef((props, ref) => {
    const [st, setSt] = useState({
        className: "md:text-5xl/tight text-gray-800 mb-4",
        ...props,
    });
    let title = useRef();
    useImperativeHandle(ref, () => ({ st, setSt, title }));
    return <Title {...st} ref={title} />;
});
export const TitleWithSubtitle = forwardRef((props, ref) => {
    const [st, setSt] = useState({
        div: { className: "max-w-[50%] mx-auto" },
        p: { className: "text-gray-600 text-lg" },
        ...props,
    });
    let h1title = useRef();
    useImperativeHandle(ref, () => ({ st, setSt, h1title }));
    return (
        <div {...st.div}>
            <H1Title {...st.h1title} ref={h1title} />

            <p {...st.p}>{st.subtitle}</p>
        </div>
    );
});
export const Menu = forwardRef((props, ref) => {
    const [st, setSt] = useState({
        className: "text-gray-600 hover:text-purple-800",
        ...props,
    });
    useImperativeHandle(ref, () => ({ st, setSt }));
    return (
        <a href={st.href} className={st.className}>
            {st.children}
        </a>
    );
});
export const CButton = forwardRef((props, ref) => {
    const [st, setSt] = useState({
        className:
            "bg-purple-800 text-white px-6 py-3 rounded-lg hover:bg-purple-700 mx-2",
        ...props,
    });
    useImperativeHandle(ref, () => ({ st, setSt }));
    return <button {...st} />;
});
export const Header = forwardRef((props, ref) => {
    const [st, setSt] = useState({
        header: {
            className:
                "flex justify-between items-center p-4 bg-white shadow-md px-16",
        },
        title: { label: "LYNKLE" },
        nav: {
            className: "space-x-4",
        },
        menus: [
            { index: "Home", children: "Home", href: "#" },
            { index: "Pricing", children: "Pricing", href: "#" },
            { index: "Blogs", children: "Blogs", href: "#" },
        ],
        buttons: [
            {
                index: "Login",
                children: "Log in",
                href: "/login",
                className: linkCss.outline,
            },
            { index: "Sign up", children: "Sign up", href: "/sign-up" },
        ],
        ...props,
    });
    useImperativeHandle(ref, () => ({ st, setSt }));
    return (
        <header {...st.header}>
            <Title {...st.title} />
            <nav {...st.nav}>
                {st.menus.map((menu) => (
                    <Menu key={menu.index} {...menu} />
                ))}
            </nav>
            <div className="flex items-center">
                {st.buttons.map((button) => (
                    <LinkButton key={button.index} {...button} />
                ))}
            </div>
        </header>
    );
});
export const Brands = forwardRef((props, ref) => {
    const [st, setSt] = useState({
        div1: {
            className: "text-2xl mt-8",
            label: "Trusted by industry leaders",
        },
        div2: { className: "flex justify-center" },
        img: { className: " w-[150px] mx-4 h-24" },
        ...props,
    });
    useImperativeHandle(ref, () => ({ st, setSt }));
    return (
        <>
            <div className={st.div1.className}>{st.div1.label}</div>
            <div {...st.div2}>
                {st.brands.map((brand) => (
                    <img
                        key={brand[1]}
                        src={brand[0]}
                        alt={brand[1]}
                        className={st.img.className}
                    />
                ))}
            </div>
        </>
    );
});
export const GComponent = forwardRef((props, ref) => {
    const [st, setSt] = useState({
        ...props.props,
    });
    useImperativeHandle(ref, () => ({ st, setSt }));
    return <div>{props.children}</div>;
});
export const linkCss = {
    outline:
        "border border-purple-800 text-purple-800 px-6 py-3 rounded-lg hover:bg-purple-700 hover:text-white mx-1 mouse-pointer select-none block w-fit",
    solid: "bg-purple-800 text-white px-6 py-3 rounded-lg hover:bg-purple-700 mx-2 mouse-pointer select-none block w-fit",
};
export const IntroPage = forwardRef((props, ref) => {
    let brands = [
        [
            "https://lynkle.com/landing/trusted-by/rolls-royce.svg",
            "Rolls Royce logo",
        ],
        [
            "https://lynkle.com/landing/trusted-by/delta-airlines.svg",
            "Delta Airlines logo",
        ],
        [
            "https://lynkle.com/landing/trusted-by/roberto-cavalli.svg",
            "Roberto Cavalli logo",
        ],
        ["https://lynkle.com/landing/trusted-by/ibm.svg", "HSBC logo"],
        [
            "https://lynkle.com/landing/trusted-by/ucla.svg",
            "UCLA Berkeley logo",
        ],
    ];
    const [st, setSt] = useState({
        section: {
            className:
                "flex flex-col items-center text-center py-16 bg-white h-screen gap-2",
        },
        title: {
            h1title: { label: "Create your digital business card in seconds" },
            subtitle: "Instantly share who you are with anyone, anywhere.",
        },
        cbutton: {
            children: "Get started free",
            href: "/sign-up",
            className: linkCss.solid,
        },
        brands: { brands },
        ...props,
    });
    let title = useRef();
    let cbutton = useRef();
    let brandsRef = useRef();
    useImperativeHandle(ref, () => ({ st, setSt, title, cbutton, brandsRef }));
    return (
        <section {...st.section}>
            <TitleWithSubtitle {...st.title} ref={title} />
            <LinkButton ref={cbutton} {...st.cbutton} />
            <Brands {...st.brands} ref={brandsRef} />
        </section>
    );
});
export const LImage = forwardRef((props, ref) => {
    const [st, setSt] = useState({
        div: { className: "shadow-lg text-center md:w-1/4 rounded-lg" },
        img: {
            src: "https://lynkle.com/landing/card-shot.svg",
            alt: "Profile",
            className: "mx-auto",
        },
        ...props,
    });
    useImperativeHandle(ref, () => ({ st, setSt }));
    return (
        <div {...st.div}>
            <img {...st.img} />
        </div>
    );
});
export const FirstImpression = forwardRef((props, ref) => {
    const [st, setSt] = useState({
        section: {
            className:
                "py-4 flex flex-row items-center justify-center bg-gray-50",
        },
        div: { className: "flex flex-col" },
        title: {
            h1title: {
                label: "Leave a lasting first impression",
                className: "text-4xl text-gray-800 mb-4",
            },
            subtitle:
                "Create a free digital business card optimized to elevate your personal or business brand.",
            p: {
                className: "text-gray-600 mb-4 text-xl",
            },
            div: {
                className: "w-[90%]",
            },
        },
        cbutton: [
            {
                children: "Get started free",
                href: "/sign-up",
                className: linkCss.outline,
            },
            {
                children: "Try Me",
                href: "https://lynkle.com/emily?utm_source=home_page&utm_medium=internal&utm_campaign=lynkle_landing",
                className: linkCss.solid,
            },
        ],
        img: {},
        ...props,
    });
    useImperativeHandle(ref, () => ({ st, setSt }));
    return (
        <section {...st.section}>
            <div {...st.div}>
                <TitleWithSubtitle {...st.title} />

                <div className="flex">
                    {st.cbutton.map((cbutton) => (
                        <LinkButton key={cbutton.href} {...cbutton} />
                    ))}
                </div>
            </div>
            <LImage {...st.img} />
        </section>
    );
});
export const LinkButton = forwardRef((props, ref) => {
    const [st, setSt] = useState({
        className:
            "bg-purple-800 text-white px-6 py-3 rounded-lg hover:bg-purple-700 mx-2 mouse-pointer select-none block w-fit",
        ...props,
    });

    useImperativeHandle(ref, () => ({ st, setSt }));
    return <a {...st} />;
});
