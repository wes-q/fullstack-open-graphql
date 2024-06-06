import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import RootLayout from "./components/RootLayout";

const App = () => {
    const [page, setPage] = useState("authors");

    const router = createBrowserRouter(
        createRoutesFromElements(
            <>
                <Route path="/" element={<RootLayout />}>
                    <Route index element={<Authors />} />
                    <Route path="books" element={<Books />} />
                    <Route path="new-book" element={<NewBook />} />
                </Route>
            </>
        )
    );

    return <RouterProvider router={router} />;
};

export default App;
