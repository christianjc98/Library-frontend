import { Link } from "react-router-dom";
import ReviewModel from "../../models/ReviewModel";
import Review from "../Utils/Review";

interface Props {
  reviews: ReviewModel[];
  bookId: number | undefined;
  mobile: boolean;
}

const LatestReviews = ({ reviews, bookId, mobile }: Props): JSX.Element => {
  return (
    <div className={mobile ? "mt-3" : "row mt-5"}>
      <div className={mobile ? "" : "col-sm-2 col-md-2"}>
        <h2>Latest Reviews: </h2>
      </div>
      <div className="col-sm-10 col-md-10">
        {reviews.length > 0 ? (
          <>
            {reviews.slice(0, 3).map((review) => {
              return <Review review={review} key={review.id}></Review>;
            })}
            <div className="m-3">
              <Link
                to={`/reviewList/${bookId}`}
                type="button"
                className="btn main-color btn-md text-white"
              >
                Reach all Reviews
              </Link>
            </div>
          </>
        ) : (
          <div className="m-3">
            <p className="lead">Currently there are no reviews for this book</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default LatestReviews;
