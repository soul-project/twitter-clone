import React from "react";
import { Button, Link } from "@chakra-ui/react";

export default function SidebarButton({ href, icon, title }: Props) {
  return (
    <Link href={href}>
      <Button variant="link" leftIcon={icon} fontSize="2xl">
        {title}
      </Button>
    </Link>
  );
}

type Props = {
  href: string;
  icon: React.ReactElement<any>;
  title: string;
};
