import React from "react";
import { Button, VStack } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import { AiFillHome } from "react-icons/ai";
import { BsFillPersonFill, BsTwitter } from "react-icons/bs";
import { IoIosSend } from "react-icons/io";
import { signIn, signOut, useSession } from "next-auth/react";

import SidebarButton from "./Sidebar/SidebarButton";
import ProfileBadge from "./Sidebar/ProfileBadge";

export default function Sidebar() {
  const { data: session } = useSession();

  return (
    <VStack
      alignItems="flex-start"
      justifyContent="space-between"
      minHeight="100vh"
      paddingTop="32px"
      paddingBottom="32px"
      w="275px"
      position="sticky"
      top="0px"
    >
      <VStack spacing="48px" alignItems="flex-start">
        <Icon as={BsTwitter} w="32px" h="32px" color="yellow" />
        <SidebarButton title="Home" icon={<Icon as={AiFillHome} />} href="/" />
        <SidebarButton
          title="Profile"
          icon={<Icon as={BsFillPersonFill} />}
          href="/"
        />
        <SidebarButton title="Tweet" icon={<Icon as={IoIosSend} />} href="/" />
      </VStack>
      {session ? (
        <ProfileBadge
          username={session.user.username}
          userHandle={session.user.userHandle}
          onSignOut={() => signOut()}
        />
      ) : (
        <Button onClick={() => signIn("soul")}>Log in</Button>
      )}
    </VStack>
  );
}
