// frontend/src/pages/Home.tsx

const Home = () => {
    // Generate an array of sections to simulate extensive content
    const sections = Array.from({length: 10}, (_, index) => index + 1);

    return (
        <div className="flex flex-col w-full h-full space-y-8">
            {/* Header for the Home page */}
            <header className="text-center">
                <h1 className="text-4xl font-bold mb-4">Welcome to the Home Page</h1>
                <p className="text-lg text-gray-600">
                    Explore the various sections below to learn more about our features and offerings.
                </p>
            </header>

            {/* Main Content Sections */}
            {sections.map((section) => (
                <section key={section} className="space-y-4">
                    <h2 className="text-2xl font-semibold">Section {section}</h2>
                    <p className="text-gray-700">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p className="text-gray-700">
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                        mollit anim id est laborum.
                    </p>
                    {/* Placeholder Image */}
                    <img
                        src={`https://via.placeholder.com/800x400?text=Section+${section}`}
                        alt={`Section ${section} Illustration`}
                        className="w-full h-auto rounded-md shadow-md"
                    />
                </section>
            ))}

            {/* Footer Section */}
            <footer className="text-center">
                <p className="text-gray-500">
                    &copy; {new Date().getFullYear()} Your Company. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default Home;
