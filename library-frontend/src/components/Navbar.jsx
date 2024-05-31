import { NavLink, Link } from "react-router-dom";

const Navbar = () => {
    return (
        <div className="bg-secondary h-20 flex justify-center w-full">
            <div className="flex justify-between items-center w-full max-w-[900px]">
                <Link className="h-full py-2 flex" to="/">
                    {/* <img className="" src={seranaImage} alt="serana logo" /> */}
                </Link>

                <div style={{ display: "flex", gap: 10 }}>
                    <NavLink to="/">Authors</NavLink>
                    <NavLink to="books">Books</NavLink>
                    <NavLink to="add">Add Book</NavLink>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
