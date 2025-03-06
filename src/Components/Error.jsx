import PropTypes from "prop-types";

const Error = ({ errorText }) => {
  return (
    <p className="font-semibold text-red-700 dark:text-red-400 m-2">
      {errorText}
    </p>
  );
};

Error.propTypes = {
  errorText: PropTypes.string.isRequired,
};

export default Error;
