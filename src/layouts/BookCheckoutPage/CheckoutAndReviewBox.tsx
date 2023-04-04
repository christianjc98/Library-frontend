import { Link } from "react-router-dom";
import BookModel from "../../models/BookModel";
import LeaveAReview from "../Utils/LeaveAReview";

interface Props {
  book: BookModel | undefined;
  mobile: boolean;
  currentLoansCount: number;
  isAuthenticated: any;
  isCheckedOut: boolean;
  checkoutBook: any;
  isReviewLeft: boolean;
  submitReview: any;
}

const CheckoutAndReviewBox = ({
  book,
  mobile,
  currentLoansCount,
  isAuthenticated,
  isCheckedOut,
  checkoutBook,
  isReviewLeft,
  submitReview,
}: Props): JSX.Element => {
  const buttonRender = () => {
    if (isAuthenticated) {
      if (!isCheckedOut && currentLoansCount < 5) {
        return (
          <button
            onClick={() => checkoutBook()}
            className="btn btn-success btn-lg"
          >
            Checkout
          </button>
        );
      } else if (isCheckedOut) {
        return (
          <p>
            <b>Book checked out.Enjoy</b>
          </p>
        );
      } else if (!isCheckedOut) {
        return <p className="text-danger">Too many books checked out.</p>;
      }
    }
    return (
      <Link to={"/login"} className="btn btn-success btn-lg">
        Sign In
      </Link>
    );
  };

  const reviewRender = () => {
    if (isAuthenticated && !isReviewLeft) {
      return <LeaveAReview submitReview={submitReview} />;
    } else if (isAuthenticated && isReviewLeft) {
      return (
        <p>
          <b>Thank you for your review!</b>
        </p>
      );
    }

    return (
      <div>
        <hr />
        <p>Sign In to be able to leave a review.</p>
      </div>
    );
  };

  return (
    <div
      className={
        mobile ? "card d-flex mt-5" : "card col-3 container d-flex mb-5"
      }
    >
      <div className="card-body container">
        <div className="mt-3">
          <p>
            <b>{currentLoansCount}/5 </b>
            books checked out
          </p>
          <hr />
          {book && book.copiesAvailable && book.copiesAvailable > 0 ? (
            <h4 className="text-success">Available</h4>
          ) : (
            <h4 className="text-danger">Wait List</h4>
          )}
          <div className="row">
            <p className="col-6 lead">
              <b>{book?.copies} </b>copies
            </p>
            <p className="col-6 lead">
              <b>{book?.copiesAvailable} </b>available
            </p>
          </div>
        </div>
        {buttonRender()}
        <hr />
        <p className="mt-3">
          This number can change until placing order has been complete
        </p>
        {reviewRender()}
      </div>
    </div>
  );
};
export default CheckoutAndReviewBox;
