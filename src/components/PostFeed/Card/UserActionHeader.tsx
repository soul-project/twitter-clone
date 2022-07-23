import React from "react";
import {
  HStack,
  Menu,
  MenuButton,
  IconButton,
  Icon,
  MenuList,
  MenuItem,
  Box,
  Text,
  Link,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import humanizeDuration from "humanize-duration";
import { BsThreeDots } from "react-icons/bs";

import { Post } from "src/modules/posts/getList";

export default function UserActionHeader({
  userId,
  post,
  userHandle,
  onDestroyPost,
}: Props) {
  return (
    <HStack justifyContent="space-between" spacing="16px" w="100%" minW="0px">
      <Link
        display="inline-block"
        href={`/profiles/${post.userId}`}
        flexShrink={1}
        overflow="hidden"
      >
        <Text
          fontWeight="bold"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          overflow="hidden"
        >
          {userHandle}
        </Text>
      </Link>
      <Text
        flexShrink={0}
        whiteSpace="nowrap"
        textOverflow="ellipsis"
        overflow="hidden"
        flexGrow={1}
      >
        {humanizeDuration(Date.now() - post.createdAt.getTime(), {
          largest: 1,
          round: true,
          units: ["y", "mo", "w", "d", "h", "m"],
        })}
      </Text>
      <Box flexShrink={0}>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<Icon as={BsThreeDots} />}
            variant="ghost"
            disabled={userId !== post.userId}
            flexShrink={0}
          >
            Actions
          </MenuButton>
          <MenuList>
            <MenuItem onClick={onDestroyPost}>
              <DeleteIcon mr="12px" color="red" />
              <span>Delete</span>
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </HStack>
  );
}

type Props = {
  userId?: number;
  post: Post;
  userHandle: string;
  onDestroyPost: () => void;
};
