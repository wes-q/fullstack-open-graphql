import { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_AUTHOR, ALL_AUTHORS } from "../queries";

const UpdateAuthor = ({ authors }) => {
    const [authorName, setAuthorName] = useState("");
    const [birthYear, setBirthYear] = useState("");

    const [updateAuthor, { data, loading, error }] = useMutation(UPDATE_AUTHOR, {
        refetchQueries: [{ query: ALL_AUTHORS }],
    });

    const handleChange = (event) => {
        setAuthorName(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        updateAuthor({ variables: { name: authorName, setBornTo: parseInt(birthYear) } });

        setAuthorName("");
        setBirthYear("");
    };
    return (
        <>
            <h2>Set birthyear</h2>
            <form onSubmit={handleSubmit}>
                <select value={authorName} onChange={handleChange}>
                    {authors.map((a) => {
                        return (
                            <option key={a.name} value={a.name}>
                                {a.name}
                            </option>
                        );
                    })}
                </select>

                <div>
                    Birth Year
                    <input type="number" value={birthYear} onChange={({ target }) => setBirthYear(target.value)} />
                </div>
                <button type="submit">Update Author</button>
            </form>
        </>
    );
};

export default UpdateAuthor;

// import { useState } from "react";
// import { useMutation } from "@apollo/client";
// import { UPDATE_AUTHOR, ALL_AUTHORS } from "../queries";

// const UpdateAuthor = ({ authors }) => {
//     const [authorName, setAuthorName] = useState("");
//     const [birthYear, setBirthYear] = useState("");

//     const [updatedAuthor, { data, loading, error }] = useMutation(UPDATE_AUTHOR, {
//         refetchQueries: [{ query: ALL_AUTHORS }],
//     });

//     const handleAuthorChange = (event) => {
//         setAuthorName(event.target.value); // Set authorName based on selected value
//     };

//     const handleSubmit = async (event) => {
//         event.preventDefault();

//         updatedAuthor({ variables: { name: authorName, setBornTo: parseInt(birthYear) } });
//         console.log("Edit Author details...");

//         setAuthorName("");
//         setBirthYear("");
//     };

//     return (
//         <>
//             <h2>Set birthyear</h2>
//             <form onSubmit={handleSubmit}>
//                 <select value={authorName} onChange={handleAuthorChange}>
//                     {" "}
//                     {/* Set initial value and correct event handler */}
//                     {authors.map((a) => {
//                         return (
//                             <option key={a.name} value={a.name}>
//                                 {a.name}
//                             </option>
//                         );
//                     })}
//                 </select>

//                 <div>
//                     Birth Year
//                     <input type="number" value={birthYear} onChange={({ target }) => setBirthYear(target.value)} />
//                 </div>
//                 <button type="submit">Update Author</button>
//             </form>
//         </>
//     );
// };

// export default UpdateAuthor;
