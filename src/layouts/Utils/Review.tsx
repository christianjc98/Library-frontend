import ReviewModel from "../../models/ReviewModel";
import StarsReviews from "./StarsReviews";

interface Props {
  review: ReviewModel;
}

const Review = ({ review }: Props): JSX.Element => {
  const date = new Date(review.date);
  const longMonth = date.toLocaleString("en-us", { month: "long" });
  const dateDay = date.getDate();
  const dateYear = date.getFullYear();

  const dateRender = `${longMonth} ${dateDay}, ${dateYear}`;
  return (
    <div>
      <div className="col-sm-8 col-md-8">
        <h5>{review.userEmail}</h5>
        <div className="row">
          <div className="col">{dateRender}</div>
          <div className="col">
            <StarsReviews size={16} rating={review.rating} />
          </div>
        </div>
        <div className="mt-2">
          <p>{review.reviewDescription}</p>
        </div>
      </div>
      <hr />
    </div>
  );
};
export default Review;
