import { useState } from "react";
import ErrorModal from "../components/ErrorModal";

const useErrorHandler = () => {
  const [error, setError] = useState("");
  const handleError = (error) => {
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      const formattedError = Object.keys(errorData)
        .map((key) => `${key}: ${errorData[key]}`)
        .join(", ");
      setError(formattedError);
    } else {
      setError("Connection error.");
    }
  };

  const closeErrorModal = () => {
    setError("");
  };

  const ErrorModalComponent = error && (
    <ErrorModal errorMessage={error} onClose={closeErrorModal} />
  );

  return { handleError, ErrorModalComponent };
};

export default useErrorHandler;
