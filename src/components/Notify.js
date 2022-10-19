import { Alert } from 'react-bootstrap';

const Notify = ({ isSuccess, isFailed, successMessage, failMessage }) => {
  if (isSuccess) {
    return <Alert variant="success">{successMessage}</Alert>;
  }

  if (isFailed) {
    return <Alert variant="danger">{failMessage}</Alert>;
  }

  return null;
};

export default Notify;
