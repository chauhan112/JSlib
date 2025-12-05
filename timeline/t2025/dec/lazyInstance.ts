export const LazyInstance = (creator: () => any) => {
    let s: { [key: string]: any } = { instance: null, creator: creator };
    const get = () => {
        if (s.instance === null) {
            s.instance = s.creator();
        }
        return s.instance;
    }

    return { get };
}