// frontend/src/pages/Home.tsx
import Calendar from "@/components/dashboard/Calendar.tsx";

const Home = () => {

    return (
        <div className="flex flex-col w-full h-full space-y-8">
            <Calendar/>
        </div>
    );
};

export default Home;