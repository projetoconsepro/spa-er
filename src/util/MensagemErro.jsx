import React from "react";
import { Group, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

const MensagemErro = ({ children, ...espaco }) => (
  <Group spacing={6} noWrap role="alert" {...espaco}>
    <IconAlertCircle size="1.1rem" color="#E03131" style={{ flexShrink: 0 }} />
    <Text size="sm" color="red.8">
      {children}
    </Text>
  </Group>
);

export default MensagemErro;
