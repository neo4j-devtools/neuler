import React from "react";

export const Render = ({ if: cond, children }) => {
  return cond ? React.Children.only(children) : null;
};