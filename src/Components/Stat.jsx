import React from "react";

const Stat = ({ number, text }) => {
  return (
    <p className="text-center text-lg font-medium uppercase">
      <span className="block text-6xl font-black">{number}</span>
      {text}
    </p>
  );
};

export default Stat;
