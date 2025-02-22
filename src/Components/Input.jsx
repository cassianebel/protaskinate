const Input = ({ label, name, type, value, changeHandler, required }) => {
  return (
    <>
      <label htmlFor={name} className="block mx-2">
        {label}
      </label>
      <input
        name={name}
        className="block w-full p-2 mb-2 border border-zinc-300 bg-zinc-100 rounded-md dark:border-zinc-700 dark:bg-zinc-800"
        type={type}
        value={value}
        onChange={changeHandler}
        maxLength={200}
        {...(required && { required: true })}
      />
    </>
  );
};

export default Input;
