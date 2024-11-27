// frontend/src/hooks/useIsSmallScreen.ts

import {useState, useEffect} from "react";
import throttle from "lodash/throttle";

const useIsSmallScreen = (breakpoint: number = 768): boolean => {
    const [isSmall, setIsSmall] = useState<boolean>(window.innerWidth < breakpoint);

    useEffect(() => {
        const handleResize = throttle(() => {
            setIsSmall(window.innerWidth < breakpoint);
        }, 200); // Throttle to every 200ms

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            handleResize.cancel();
        };
    }, [breakpoint]);

    return isSmall;
};

export default useIsSmallScreen;
