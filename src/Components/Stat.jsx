import PropTypes from "prop-types";

const Stat = ({ number, text }) => {
  return (
    <p className="text-center text-lg font-medium uppercase">
      <span className="block text-6xl font-black">{number}</span>
      {text}
    </p>
  );
};

Stat.propTypes = {
  number: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
};

export default Stat;
