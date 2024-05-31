import { useState } from "react";
import { NEW_BOOK } from "../queries";
import { useMutation } from "@apollo/client";
import { ALL_BOOKS, ALL_AUTHORS } from "../queries";

const NewBook = () => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [published, setPublished] = useState("");
    const [genre, setGenre] = useState("");
    const [genres, setGenres] = useState([]);

    const [newBook, { data, loading, error }] = useMutation(NEW_BOOK, {
        refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    });

    const submit = async (event) => {
        event.preventDefault();

        newBook({ variables: { title, author, published: parseInt(published), genres } });
        console.log("add new book...");

        setTitle("");
        setPublished("");
        setAuthor("");
        setGenres([]);
        setGenre("");
    };

    const addGenre = () => {
        setGenres(genres.concat(genre));
        setGenre("");
    };

    return (
        <div>
            <form onSubmit={submit}>
                <div>
                    Title
                    <input value={title} onChange={({ target }) => setTitle(target.value)} />
                </div>
                <div>
                    Author
                    <input value={author} onChange={({ target }) => setAuthor(target.value)} />
                </div>
                <div>
                    Published
                    <input type="number" value={published} onChange={({ target }) => setPublished(target.value)} />
                </div>
                <div>
                    <input value={genre} onChange={({ target }) => setGenre(target.value)} />
                    <button onClick={addGenre} type="button">
                        Add genre
                    </button>
                </div>
                <div>Genres: {genres.join(" ")}</div>
                <button type="submit">Create book</button>
            </form>
        </div>
    );
};

export default NewBook;
