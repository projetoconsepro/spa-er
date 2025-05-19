// BotaoPadrao.jsx
import { Button } from "@mantine/core";
import React from "react";

const BotaoPadrao = ({ onClick, children, space }) => {
  return (
    <Button
      className={space ? "bg-gray-500 mx-2" : "bg-gray-500"}
      size="md"
      radius="md"
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default BotaoPadrao;
