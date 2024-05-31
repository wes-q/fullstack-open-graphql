import { ALL_BOOKS } from "../queries";
import { useQuery } from "@apollo/client";

const Books = () => {
    const { loading, error, data } = useQuery(ALL_BOOKS, {});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    const books = data.allBooks;

    return (
        <div>
            <h2>Books</h2>

            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>author</th>
                        <th>published</th>
                    </tr>
                    {books.map((a) => (
                        <tr key={a.title}>
                            <td>{a.title}</td>
                            <td>{a.author}</td>
                            <td>{a.published}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Books;
