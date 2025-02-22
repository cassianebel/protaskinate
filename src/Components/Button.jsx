const Button = ({ text, type, style, icon, action }) => {
  let buttonStyle;

  if (style === "primary") {
    buttonStyle =
      "border border-2 border-zinc-900 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-800 dark:bg-zinc-200 dark:border-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-100 dark:hover:border-zinc-100";
  } else if (style === "secondary") {
    buttonStyle =
      "border border-2 border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-zinc-300 dark:border-zinc-200 dark:text-zinc-200 dark:hover:bg-zinc-200 dark:hover:text-zinc-900";
  } else if (style === "danger") {
    buttonStyle =
      "border border-2 border-red-600 bg-red-600 text-zinc-50 hover:bg-red-500 hover:border-red-500";
  }
  return (
    <button
      type={type ? type : "button"}
      className={`w-full my-3 p-2 px-4 rounded-md flex items-center justify-center gap-2 ${buttonStyle}`}
      onClick={action ? action : null}
    >
      {icon ? icon : ""}
      <span>{text}</span>
    </button>
  );
};

export default Button;
