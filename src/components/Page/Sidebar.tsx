import React from "react";
import { Button, Link, useDisclosure, VStack } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import { AiFillHome } from "react-icons/ai";
import { BsFillPersonFill, BsTwitter } from "react-icons/bs";
import { IoIosSend } from "react-icons/io";
import { signIn, signOut, useSession } from "next-auth/react";

import SidebarButton from "./Sidebar/SidebarButton";
import ProfileBadge from "./Sidebar/ProfileBadge";
import CreateNewPostModal from "./Sidebar/CreateNewPostModal";

export default function Sidebar() {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <CreateNewPostModal onClose={onClose} isOpen={isOpen} />
      <VStack
        alignItems="flex-start"
        justifyContent="space-between"
        minHeight="100vh"
        paddingTop="32px"
        paddingBottom="32px"
        position="sticky"
        top="0px"
        marginLeft="12px"
      >
        <VStack spacing="32px" alignItems="flex-start">
          <Link href="/">
            <Button variant="ghost">
              <Icon as={BsTwitter} w="32px" h="32px" color="yellow" />
            </Button>
          </Link>
          <SidebarButton
            title="Home"
            icon={<Icon as={AiFillHome} />}
            href="/"
          />
          {session && (
            <SidebarButton
              title="Profile"
              icon={<Icon as={BsFillPersonFill} />}
              href={`/profiles/${session?.user.id}`}
            />
          )}
          {session && (
            <SidebarButton
              title="Post"
              icon={<Icon as={IoIosSend} />}
              onClick={onOpen}
            />
          )}
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
    </>
  );
}
