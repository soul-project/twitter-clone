import React from "react";
import { Button, Link } from "@chakra-ui/react";

export default function SidebarButton({ href, icon, title, onClick }: Props) {
  return (
    <Link href={href} _hover={{ textDecoration: "none" }}>
      <Button
        variant="ghost"
        leftIcon={icon}
        fontSize="2xl"
        onClick={onClick}
        py="16px"
      >
        {title}
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
