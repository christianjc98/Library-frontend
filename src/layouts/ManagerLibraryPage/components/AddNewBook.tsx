import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import AddBookRequest from "../../../models/AddBookRequest";

const bookInitialState = {
  title: "",
  author: "",
  description: "",
  copies: 0,
  category: "Category",
  selectedImg: "",
};

const AddNewBook = () => {
  const { authState } = useOktaAuth();

  //New book
  const [book, setBook] = useState(bookInitialState);

  //Displays
  const [displayWarning, setDisplayWarning] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);

  const handleChange = (e: any) => {
    if (e.target.type === "number") {
      setBook({ ...book, [e.target.name]: Number(e.target.value) });
    } else {
      setBook({ ...book, [e.target.name]: e.target.value });
    }
  };

  const base64ConversionForImages = (e: any) => {
    if (e.target.files[0]) {
      getBase64(e.target.files[0]);
    }
  };

  const getBase64 = (file: any) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setBook({ ...book, ["selectedImg"]: reader.result! as string });
    };
    reader.onerror = (err) => {
      console.log(err);
    };
  };

  const handleSubmit = async () => {
    const url = `${process.env.REACT_APP_API}/admin/secure/book`;
    if (
      authState?.isAuthenticated &&
      book.title !== "" &&
      book.author !== "" &&
      book.category !== "Category" &&
      book.description !== "" &&
      book.copies > 0
    ) {
      const addBookRequest: AddBookRequest = new AddBookRequest(
        book.title,
        book.author,
        book.description,
        book.copies,
        book.category
      );
      addBookRequest.img = book.selectedImg;
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addBookRequest),
      };
      const submitNewBookResponse = await fetch(url, requestOptions);

      if (!submitNewBookResponse) {
        throw new Error("Something went wrong");
      }
      setBook(bookInitialState);
      setDisplayWarning(false);
      setDisplaySuccess(true);
    } else {
      setDisplayWarning(true);
      setDisplaySuccess(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      {displaySuccess && (
        <div className="alert alert-success" role="alert-">
          Book added successfully
        </div>
      )}
      {displayWarning && (
        <div className="alert alert-danger" role="alert-">
          All fields must be filled out
        </div>
      )}
      <div className="card">
        <div className="card-header">Add a new book</div>
        <div className="card-body">
          <form action="POST">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  onChange={handleChange}
                  value={book.title}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Author</label>
                <input
                  type="text"
                  className="form-control"
                  name="author"
                  onChange={handleChange}
                  value={book.author}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  name="category"
                  value={book.category}
                  onChange={handleChange}
                >
                  <option></option>
                  <option value="FE">Front End</option>
                  <option value="BE">Back End</option>
                  <option value="Data">Data</option>
                  <option value="DevOps">DevOps</option>
                </select>
              </div>
              <div className="col-md-12 mb-3">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  id="exampleFormControlTextarea1"
                  rows={3}
                  onChange={handleChange}
                  value={book.description}
                ></textarea>
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Copies</label>
                <input
                  type="number"
                  className="form-control"
                  name="copies"
                  onChange={handleChange}
                  value={book.copies}
                />
              </div>
              <input
                type="file"
                onChange={(e) => base64ConversionForImages(e)}
              />
              <div>
                <button
                  onClick={handleSubmit}
                  className="btn btn-primary mt-3"
                  type="button"
                >
                  Add Book
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default AddNewBook;
