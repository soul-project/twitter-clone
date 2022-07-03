import React from "react";
import { Button, Link, Text } from "@chakra-ui/react";

export default function SidebarButton({ href, icon, title, onClick }: Props) {
  return (
    <Link href={href} _hover={{ textDecoration: "none" }}>
      <Button
        variant="ghost"
        fontSize="2xl"
        onClick={onClick}
        py="12px"
        height="auto"
      >
        {icon}
        <Text ml="20px" display={["none", "none", "none", "inline-block"]}>
          {title}
        </Text>
      </Button>
    </Link>
  );
}

type Props = {
  href?: string;
  icon: React.ReactElement<any>;
  title: string;
  onClick?: () => void;
};
