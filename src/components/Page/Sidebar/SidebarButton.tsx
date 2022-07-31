import React from "react";
import { Button, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";

function LinkButton({ href, onClick, icon, title }: Props) {
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

export default function SidebarButton({ href, ...props }: Props) {
  if (href && href.startsWith("/")) {
    return (
      <NextLink passHref href={href}>
        <LinkButton {...props} />
      </NextLink>
    );
  }

  return <LinkButton href={href} {...props} />;
}

type Props = {
  href?: string;
  icon: React.ReactElement<any>;
  title: string;
  onClick?: () => void;
};
