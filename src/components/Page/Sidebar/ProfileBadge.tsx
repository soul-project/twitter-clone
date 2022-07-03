import {
  Popover,
  PopoverTrigger,
  Button,
  HStack,
  Avatar,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Text,
} from "@chakra-ui/react";

export default function ProfileBadge({
  onSignOut,
  userHandle,
  username,
}: Props) {
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="ghost" w="auto" h="100%" py="12px">
          <HStack>
            <Avatar name={username} size="sm" />
            <Text fontWeight="bold">{userHandle}</Text>
          </HStack>
        </Button>
      </PopoverTrigger>
      <PopoverContent width="100%">
        <PopoverArrow />
        <PopoverBody>
          <Button onClick={onSignOut} variant="ghost">
            Log out {userHandle}
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

type Props = {
  onSignOut: () => void;
  userHandle: string;
  username: string;
};
