import { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_AUTHOR, ALL_AUTHORS } from "../queries";

const UpdateAuthor = () => {
    const [authorName, setAuthorName] = useState("");
    const [birthYear, setBirthYear] = useState("");

    const [updatedAuthor, { data, loading, error }] = useMutation(UPDATE_AUTHOR, {
        refetchQueries: [{ query: ALL_AUTHORS }],
    });

    const handleSubmit = async (event) => {
        event.preventDefault();

        updatedAuthor({ variables: { name: authorName, setBornTo: parseInt(birthYear) } });
        console.log("Edit Author details...");

        setAuthorName("");
        setBirthYear("");
    };
    return (
        <>
            <h2>Set birthyear</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    Author Name
                    <input type="text" value={authorName} onChange={({ target }) => setAuthorName(target.value)} />
                </div>
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
