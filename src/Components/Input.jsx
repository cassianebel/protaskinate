import PropTypes from "prop-types";

const Input = ({ label, name, type, value, changeHandler, required }) => {
  return (
    <>
      <label htmlFor={name} className="block mx-2 mb-1 font-light">
        {label}
      </label>
      <input
        id={name}
        name={name}
        className="block w-full p-2 mb-6 border border-zinc-300 bg-zinc-100 rounded-md dark:border-zinc-700 dark:bg-zinc-800"
        type={type}
        value={value}
        onChange={changeHandler}
        maxLength={200}
        {...(required && { required: true })}
      />
    </>
  );
};

Input.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  changeHandler: PropTypes.func.isRequired,
  required: PropTypes.bool,
};

export default Input;
