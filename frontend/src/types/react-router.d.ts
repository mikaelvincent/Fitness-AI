// frontend/src/types/react-router.d.ts

import "react-router-dom";

// Define the structure of the data you want to pass
export interface RegisterLoginResponseData {
    id: number;
    email: string;
    name: string;
    token: string; // Include token in the interface
}

// Extend the LocationState interface to include your custom data
declare module "react-router-dom" {
    interface LocationState {
        data: RegisterLoginResponseData;
    }
}
