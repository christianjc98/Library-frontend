import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import MessageModel from "../../../models/MessageModel";

const initialMessageState = { title: "", question: "" };

const PostNewMessage = () => {
  const { authState } = useOktaAuth();
  const [message, setMessage] = useState(initialMessageState);
  const [displayWarning, setDisplayWarning] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);

  const handleChange = (e: any) => {
    setMessage({ ...message, [e.target.name]: e.target.value });
  };

  const submitQuestion = async () => {
    const url = `${process.env.REACT_APP_API}/messages/secure/message`;
    if (
      authState?.isAuthenticated &&
      message.title !== "" &&
      message.question !== ""
    ) {
      const messageRequestModel: MessageModel = new MessageModel(
        message.title,
        message.question
      );
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageRequestModel),
      };
      const submitNewQuestionResponse = await fetch(url, requestOptions);
      console.log(submitNewQuestionResponse);
      console.log(requestOptions.body);

      if (!submitNewQuestionResponse) {
        throw new Error("Something went wrong");
      }
      setMessage(initialMessageState);
      setDisplayWarning(false);
      setDisplaySuccess(true);
    } else {
      setDisplayWarning(true);
      setDisplaySuccess(false);
    }
  };

  return (
    <div className="card mt-3">
      <div className="card-header">Ask question to luv2read admin</div>
      <div className="card-body">
        <form action="POST">
          {displayWarning && (
            <div className="alert alert-danger" role="alert">
              All fields must be filled out
            </div>
          )}
          {displaySuccess && (
            <div className="alert alert-success" role="alert">
              Question added successfully
            </div>
          )}
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              name="title"
              id="exampleFormControlInput1"
              placeholder="Title"
              value={message.title}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Question</label>
            <textarea
              className="form-control"
              name="question"
              id="exampleFormControlTextarea1"
              rows={3}
              value={message.question}
              onChange={handleChange}
            />
          </div>
          <div>
            <button
              onClick={submitQuestion}
              type="button"
              className="btn btn-primary mt-3"
            >
              Submit Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default PostNewMessage;
