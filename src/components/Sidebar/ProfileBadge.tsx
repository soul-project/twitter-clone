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
        <Button variant="unstyled">
          <HStack>
            <Avatar name={username} />
            <Text fontWeight="bold">{userHandle}</Text>
          </HStack>
        </Button>
      </PopoverTrigger>
      <PopoverContent width="100%">
        <PopoverArrow />
        <PopoverBody>
          <Button onClick={onSignOut}>Log out {userHandle}</Button>
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
