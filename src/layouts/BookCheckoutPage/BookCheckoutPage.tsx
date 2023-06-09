import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookModel from "../../models/BookModel";
import SpinnerLoading from "../Utils/SpinnerLoading";
import bookLuv2Code100Img from "../../Images/BooksImages/book-luv2code-1000.png";
import StarsReviews from "../Utils/StarsReviews";
import CheckoutAndReviewBox from "./CheckoutAndReviewBox";
import ReviewModel from "../../models/ReviewModel";
import LatestReviews from "./LatestReviews";
import { useOktaAuth } from "@okta/okta-react";
import ReviewRequestModel from "../../models/ReviewRequestModel";

const BookCheckoutPage = () => {
  const { authState } = useOktaAuth();

  const [book, setBook] = useState<BookModel>();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  //Review state
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [isLoadingReview, setIsLoadingReview] = useState(true);
  const [isReviewLeft, setIsReviewLeft] = useState(false);
  const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

  //Loans count state
  const [currentLoansCount, setCurrentLoansCount] = useState(0);
  const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] =
    useState(true);

  //IsBookCheckedOut
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true);

  const [displayError, setDisplayError] = useState(false);

  const { bookId } = useParams<{ bookId: string }>();

  useEffect(() => {
    const fetchBook = async () => {
      const baseUrl: string = `${process.env.REACT_APP_API}/books/${bookId}`;

      const response = await fetch(baseUrl);

      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const responseJson = await response.json();

      const loadedBook: BookModel = {
        id: responseJson.id,
        title: responseJson.title,
        author: responseJson.author,
        description: responseJson.description,
        copies: responseJson.copies,
        copiesAvailable: responseJson.copiesAvailable,
        category: responseJson.category,
        img: responseJson.img,
      };
      setBook(loadedBook);
      setIsLoading(false);
    };
    fetchBook().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, [isCheckedOut]);

  useEffect(() => {
    const fetchBookReviews = async () => {
      const reviewUrl: string = `${process.env.REACT_APP_API}/reviews/search/findByBookId?bookId=${bookId}`;

      const responseReviews = await fetch(reviewUrl);

      if (!responseReviews.ok) {
        throw new Error("Something went wrong");
      }
      const responseReviewsJson = await responseReviews.json();

      const responseData = responseReviewsJson._embedded.reviews;

      const loadedReviews: ReviewModel[] = [];

      let weightedStarReviews: number = 0;

      for (const key in responseData) {
        loadedReviews.push({
          id: responseData[key].id,
          userEmail: responseData[key].userEmail,
          date: responseData[key].date,
          rating: responseData[key].rating,
          reviewDescription: responseData[key].reviewDescription,
        });
        weightedStarReviews += responseData[key].rating;
      }

      if (loadedReviews) {
        const round = (
          Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2
        ).toFixed(1);
        setTotalStars(Number(round));
      }

      setReviews(loadedReviews);
      setIsLoadingReview(false);
    };
    fetchBookReviews().catch((error: any) => {
      setIsLoadingReview(false);
      setHttpError(error.message);
    });
  }, [isReviewLeft]);

  useEffect(() => {
    const fetchUserReviewBook = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${process.env.REACT_APP_API}/reviews/secure/user/book?bookId=${bookId}`;
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application-json",
          },
        };
        const userReview = await fetch(url, requestOptions);
        if (!userReview.ok) {
          throw new Error("Something went wrong");
        }

        const userReviewResponseJson = await userReview.json();
        setIsReviewLeft(userReviewResponseJson);
      }
      setIsLoadingUserReview(false);
    };
    fetchUserReviewBook().catch((error: any) => {
      setIsLoadingUserReview(false);
      setHttpError(error.message);
    });
  }, [authState]);

  useEffect(() => {
    const fetchUserCurrentLoansCount = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${process.env.REACT_APP_API}/books/secure/currentloans/count`;
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application-json",
          },
        };

        const currentLoansCountResponse = await fetch(url, requestOptions);
        if (!currentLoansCountResponse.ok) {
          throw new Error("Something went wrong");
        }

        const currentLoansCountResponseJson =
          await currentLoansCountResponse.json();
        setCurrentLoansCount(currentLoansCountResponseJson);
      }
      setIsLoadingCurrentLoansCount(false);
    };
    fetchUserCurrentLoansCount().catch((error: any) => {
      setIsLoadingCurrentLoansCount(false);
      setHttpError(error.message);
    });
  }, [authState, isCheckedOut]);

  useEffect(() => {
    const fetchUserCheckedOutBook = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${process.env.REACT_APP_API}/books/secure/ischeckedout/byuser/?bookId=${bookId}`;
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application-json",
          },
        };

        const bookCheckedOut = await fetch(url, requestOptions);
        if (!bookCheckedOut.ok) {
          throw new Error("Something went wrong");
        }

        const bookCheckedOutJson = await bookCheckedOut.json();
        setIsCheckedOut(bookCheckedOutJson);
      }
      setIsLoadingBookCheckedOut(false);
    };
    fetchUserCheckedOutBook().catch((error: any) => {
      setIsLoadingBookCheckedOut(false);
      setHttpError(error.message);
    });
  }, [authState]);

  if (
    isLoading ||
    isLoadingReview ||
    isLoadingCurrentLoansCount ||
    isLoadingBookCheckedOut ||
    isLoadingUserReview
  ) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  const checkoutBook = async () => {
    const url = `${process.env.REACT_APP_API}/books/secure/checkout/?bookId=${bookId}`;
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
    };

    const checkoutResponse = await fetch(url, requestOptions);
    if (!checkoutResponse.ok) {
      setDisplayError(true);
      throw new Error("Something went wrong");
    }
    setDisplayError(false);
    setIsCheckedOut(true);
  };

  const submitReview = async (starInput: number, reviewDescription: string) => {
    let bookId = 0;
    if (book?.id) {
      bookId = book.id;
    }

    const reviewRequestModel = new ReviewRequestModel(
      starInput,
      bookId,
      reviewDescription
    );

    const url = `${process.env.REACT_APP_API}/reviews/secure`;
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewRequestModel),
    };
    console.log(requestOptions.body);
    const returnResponse = await fetch(url, requestOptions);
    console.log(returnResponse);

    if (!returnResponse.ok) {
      throw new Error("Something went wrong");
    }
    setIsReviewLeft(true);
  };

  return (
    <div>
      <div className="container d-none d-lg-block">
        {displayError && (
          <div className="alert alert-danger mt-3" role="alert">
            Please pay outstanding fees and/or return late book(s)
          </div>
        )}
        <div className="row mt-5">
          <div className="col-sm-2 col-md-2">
            {book?.img ? (
              <img src={book?.img} width="226" height="349" alt="book"></img>
            ) : (
              <img
                src={bookLuv2Code100Img}
                width="226"
                height="349"
                alt="book"
              ></img>
            )}
          </div>
          <div className="col-4 col-md-4 container">
            <div className="ml-2">
              <h2>{book?.title}</h2>
              <h5 className="text-primary">{book?.author}</h5>
              <p className="lead">{book?.description}</p>
              <StarsReviews rating={totalStars} size={32} />
            </div>
          </div>
          <CheckoutAndReviewBox
            isAuthenticated={authState?.isAuthenticated}
            isCheckedOut={isCheckedOut}
            currentLoansCount={currentLoansCount}
            mobile={false}
            book={book}
            checkoutBook={checkoutBook}
            isReviewLeft={isReviewLeft}
            submitReview={submitReview}
          />
        </div>
        <hr />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
      </div>
      <div className="container d-lg-none mt-5">
        {displayError && (
          <div className="alert alert-danger mt-3" role="alert">
            Please pay outstanding fees and/or return late book(s)
          </div>
        )}
        <div className="d-flex justify-content-center align-items-center">
          {book?.img ? (
            <img src={book?.img} width="226" height="349" alt="book"></img>
          ) : (
            <img
              src={bookLuv2Code100Img}
              width="226"
              height="349"
              alt="book"
            ></img>
          )}
        </div>
        <div className="mt-4">
          <div className="ml-2">
            <h2>{book?.title}</h2>
            <h5 className="text-primary">{book?.author}</h5>
            <p className="lead">{book?.description}</p>
            <StarsReviews rating={totalStars} size={32} />
          </div>
        </div>
        <CheckoutAndReviewBox
          isAuthenticated={authState?.isAuthenticated}
          isCheckedOut={isCheckedOut}
          currentLoansCount={currentLoansCount}
          mobile={true}
          book={book}
          checkoutBook={checkoutBook}
          isReviewLeft={isReviewLeft}
          submitReview={submitReview}
        />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
        <hr />
      </div>
    </div>
  );
};
export default BookCheckoutPage;
