import BookModel from "../../../models/BookModel";
import bookLuv2Code100Img from "../../../Images/BooksImages/book-luv2code-1000.png";
import { Link } from "react-router-dom";

interface Props {
  book: BookModel;
}

const SearchBook = ({ book }: Props): JSX.Element => {
  return (
    <div className="card mt-3 mb-2 shadow p-3 mn-3 bg-body rounded">
      <div className="row g-0">
        <div className="col-md-2">
          <div className="d-none d-lg-block">
            {book.img ? (
              <img src={book.img} width="123" height="196" alt="book" />
            ) : (
              <img
                src={bookLuv2Code100Img}
                width="123"
                height="196"
                alt="book"
              />
            )}
          </div>
          <div className="d-lg-none d-flex justify-content-center align-items-center">
            {book.img ? (
              <img src={book.img} width="123" height="196" alt="book" />
            ) : (
              <img
                src={bookLuv2Code100Img}
                width="123"
                height="196"
                alt="book"
              />
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="card-body">
            <h5 className="card-title">{book.author}</h5>
            <h4>{book.title}</h4>
            <p className="card-text">{book.description}</p>
          </div>
        </div>
        <div className="col-md-4 d-flex justify-content-center align-items-center">
          <Link
            to={`/checkout/${book.id}`}
            className="btn btn-md main-color text-white"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};
export default SearchBook;
