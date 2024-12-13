import { Outlet } from "react-router-dom";

const SetupLayout = () => {
    return (
        <div className="min-h-screen flex text-foreground items-center gap-10 md:gap-40 lg:gap-0">
            <main className="flex-auto flex w-full items-start justify-center lg:items-start lg:flex-col">
                <div className="flex-1 items-start w-full justify-center h-full p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default SetupLayout;
