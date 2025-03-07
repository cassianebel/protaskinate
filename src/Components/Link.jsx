import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

const Link = ({ text, link, style }) => {
  let linkStyles;
  if (style === "primary") {
    linkStyles =
      "border border-2 border-zinc-900 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-800 dark:bg-zinc-200 dark:border-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-100 dark:hover:border-zinc-100";
  } else if (style === "secondary") {
    linkStyles =
      "border border-2 border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-zinc-300 dark:border-zinc-200 dark:text-zinc-200 dark:hover:bg-zinc-200 dark:hover:text-zinc-900";
  } else if (style === "inline") {
    linkStyles = "underline font-semibold px-1";
  }
  return (
    <NavLink
      to={link}
      className={`my-3 p-2 px-4 rounded-md duration-300 ${linkStyles}`}
    >
      {text}
    </NavLink>
  );
};

Link.propTypes = {
  text: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  style: PropTypes.oneOf(["primary", "secondary", "inline"]).isRequired,
};

export default Link;
