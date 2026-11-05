import { useState, useEffect } from "react";

export function useColumnCount() {
    const [count, setCount] = useState(2);

    useEffect(() => {
        const breakpoints = [
            window.matchMedia("(min-width: 640px)"),
            window.matchMedia("(min-width: 768px)"),
            window.matchMedia("(min-width: 1280px)"),
        ];

        const chooseCol = () => {
            if (breakpoints[2].matches) return 4;
            if (breakpoints[1].matches) return 3;
            if (breakpoints[0].matches) return 2;
            return 1;
        };

        const update = () => setCount(chooseCol());

        update();

        breakpoints.forEach(bp => bp.addEventListener("change", update));

        return () => {
            breakpoints.forEach(bp => bp.removeEventListener("change", update));
        };
    }, []);

    return count;
}