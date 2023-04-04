import { Link } from "react-router-dom";
import bookLuv2Code100Img from "../../../Images/BooksImages/book-luv2code-1000.png";
import BookModel from "../../../models/BookModel";

interface Props {
  book: BookModel;
}

const ReturnBook = ({ book }: Props): JSX.Element => {
  return (
    <div className="col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3">
      <div className="text-center">
        {book.img ? (
          <img src={book.img} width="151" height="233" alt="book" />
        ) : (
          <img src={bookLuv2Code100Img} width="151" height="233" alt="book" />
        )}

        <h6 className="mt-2">{book.title}</h6>
        <p>{book.author}</p>
        <Link to={`checkout/${book.id}`} className="btn main-color text-white">
          Reserve
        </Link>
      </div>
    </div>
  );
};
export default ReturnBook;
