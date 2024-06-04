import { useState } from "react";
import { ALL_AUTHORS } from "../queries";
import { useQuery } from "@apollo/client";
import UpdateAuthor from "./UpdateAuthor";

const Authors = () => {
    const { loading, error, data } = useQuery(ALL_AUTHORS, {});
    const [authorName, setAuthorName] = useState("");
    const [birthYear, setBirthYear] = useState("");

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    const authors = data.allAuthors;

    const handleSubmit = () => {};

    return (
        <div>
            <h2>authors</h2>
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>born</th>
                        <th>books</th>
                    </tr>
                    {authors.map((a) => (
                        <tr key={a.name}>
                            <td>{a.name}</td>
                            <td>{a.born}</td>
                            <td>{a.bookCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <UpdateAuthor></UpdateAuthor>
        </div>
    );
};

export default Authors;
