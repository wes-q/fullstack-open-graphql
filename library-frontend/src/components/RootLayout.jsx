import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function RootLayout() {
    return (
        <div className="flex flex-col min-h-screen h-full text-white bg-white text-sm sm:text-base font-nunito">
            <header>
                <nav className="fixed top-0 z-30 w-full md:justify-between md:items-center navbar text-base md:text-sm h-auto shadow-md">
                    <Navbar />
                </nav>
            </header>

            <main className="grow pt-20">
                <Outlet />
            </main>
        </div>
    );
}
