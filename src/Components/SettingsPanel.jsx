import PropTypes from "prop-types";

const SettingsPanel = ({ heading, children }) => {
  return (
    <div className="lg:min-w-sm h-min relative border-2 border-zinc-800 dark:border-zinc-200 p-6 rounded-md">
      <h3 className="w-max absolute top-[-26px] left-1/2 -translate-x-1/2 text-center text-2xl font-bold bg-zinc-200 dark:bg-zinc-950 p-2 ">
        {heading}
      </h3>
      <div>{children}</div>
    </div>
  );
};

SettingsPanel.propTypes = {
  heading: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default SettingsPanel;
