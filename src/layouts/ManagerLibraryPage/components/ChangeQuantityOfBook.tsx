import { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import bookLuv2Code100Img from "../../../Images/BooksImages/book-luv2code-1000.png";
import { useOktaAuth } from "@okta/okta-react";

interface Props {
  book: BookModel;
  deleteBook: any;
}

const ChangeQuantityOfBook = ({ book, deleteBook }: Props): JSX.Element => {
  const { authState } = useOktaAuth();
  const [quantity, setQuantity] = useState<number>(0);
  const [remaining, setRemaining] = useState<number>(0);

  useEffect(() => {
    const fetchBookInState = () => {
      book.copies ? setQuantity(book.copies) : setQuantity(0);
      book.copiesAvailable
        ? setRemaining(book.copiesAvailable)
        : setRemaining(0);
    };
    fetchBookInState();
  }, []);

  const increaseQuantity = async () => {
    const url = `${process.env.REACT_APP_API}/admin/secure/increase/book/quantity?bookId=${book.id}`;
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
    };
    const quantityUpdateResponse = await fetch(url, requestOptions);
    if (!quantityUpdateResponse.ok) {
      throw new Error("Something went wrong");
    }
    setQuantity(quantity + 1);
    setRemaining(remaining + 1);
  };

  const decreaseQuantity = async () => {
    const url = `${process.env.REACT_APP_API}/admin/secure/decrease/book/quantity?bookId=${book.id}`;
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
    };
    const quantityUpdateResponse = await fetch(url, requestOptions);
    if (!quantityUpdateResponse.ok) {
      throw new Error("Something went wrong");
    }
    setQuantity(quantity - 1);
    setRemaining(remaining - 1);
  };

  const handleDeleteBook = async () => {
    const url = `${process.env.REACT_APP_API}/admin/secure/book?bookId=${book.id}`;
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
    };
    const deleteBookResponse = await fetch(url, requestOptions);
    if (!deleteBookResponse.ok) {
      throw new Error("Something went wrong");
    }
    deleteBook();
  };

  return (
    <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
      <div className="row g-0">
        <div className="col-md-2">
          <div className="d-none d-lg-block">
            {book.img ? (
              <img src={book.img} width="123" height="196" alt="Book" />
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
              <img src={book.img} width="123" height="196" alt="Book" />
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
        <div className="mt-3 col-md-4">
          <div className="d-flex justify-content-center align-items-center">
            <p>
              Total Quantity: <b>{quantity}</b>
            </p>
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <p>
              Books Remaining: <b>{remaining}</b>
            </p>
          </div>
        </div>
        <div className="mt-3 col-md-1">
          <div className="d-flex justify-content-center align-items-center">
            <button
              onClick={handleDeleteBook}
              className="m-1 btn btn-md btn-danger"
            >
              Delete
            </button>
          </div>
        </div>
        <button
          onClick={increaseQuantity}
          className="m-1 btn btn-md main-color text-white"
        >
          Add quantity
        </button>
        <button
          onClick={decreaseQuantity}
          className="m-1 btn btn-md btn-warning"
        >
          Decrease quantity
        </button>
      </div>
    </div>
  );
};
export default ChangeQuantityOfBook;
