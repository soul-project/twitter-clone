import React from "react";
import {
  Avatar,
  Button,
  HStack,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  VStack,
  Link,
  PopoverArrow,
} from "@chakra-ui/react";
import { WarningTwoIcon, Icon } from "@chakra-ui/icons";
import { AiFillHome } from "react-icons/ai";
import { BsFillPersonFill } from "react-icons/bs";
import { IoIosSend } from "react-icons/io";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Sidebar() {
  const { data: session } = useSession();

  return (
    <nav>
      <VStack
        alignItems="flex-start"
        justifyContent="space-between"
        minHeight="100vh"
        paddingTop="32px"
        paddingBottom="32px"
      >
        <VStack spacing="48px" alignItems="flex-start">
          <WarningTwoIcon w="32px" h="32px" />
          <Link href="/">
            <Button
              variant="link"
              leftIcon={<Icon as={AiFillHome} />}
              fontSize="2xl"
            >
              Home
            </Button>
          </Link>
          <Button
            variant="link"
            leftIcon={<Icon as={BsFillPersonFill} />}
            fontSize="2xl"
          >
            Profile
          </Button>
          <Button
            variant="link"
            leftIcon={<Icon as={IoIosSend} />}
            fontSize="2xl"
          >
            Tweet
          </Button>
        </VStack>
        {session ? (
          <Popover>
            <PopoverTrigger>
              <Button variant="unstyled">
                <HStack>
                  <Avatar name={session.user.username} />
                  <Text fontWeight="bold">{session.user.userHandle}</Text>
                </HStack>
              </Button>
            </PopoverTrigger>
            <PopoverContent width="100%">
              <PopoverArrow />
              <PopoverBody>
                <Button onClick={() => signOut()}>
                  Log out {session.user.userHandle}
                </Button>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        ) : (
          <Button onClick={() => signIn("soul")}>Log in</Button>
        )}
      </VStack>
    </nav>
  );
}
