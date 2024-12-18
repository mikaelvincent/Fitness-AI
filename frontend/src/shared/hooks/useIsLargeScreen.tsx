// frontend/src/hooks/useIsLargeScreen.tsx

import {useState, useEffect} from "react";
import throttle from "lodash/throttle";

const useIsLargeScreen = (breakpoint: number = 1024): boolean => { // Updated breakpoint to 1025px
    const isClient = typeof window === 'object';
    const [largeScreen, setLargeScreen] = useState<boolean>(
        isClient ? window.innerWidth >= breakpoint : false
    );

    useEffect(() => {
        if (!isClient) return;

        const handleResize = throttle(() => {
            setLargeScreen(window.innerWidth > breakpoint);
        }, 200); // Throttle to every 200ms

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            handleResize.cancel();
        };
    }, [breakpoint, isClient]);

    return largeScreen;
};

export default useIsLargeScreen;
