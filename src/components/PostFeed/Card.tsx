import React from "react";
import {
  Avatar,
  Box,
  HStack,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import humanizeDuration from "humanize-duration";
import { useSession } from "next-auth/react";
import { BsThreeDots } from "react-icons/bs";

import { get } from "src/modules/users/get";
import { getList, Post } from "src/modules/posts/getList";
import { destroy } from "src/modules/posts/destroy";
import { DeleteIcon } from "@chakra-ui/icons";

export default function Card({ post }: Props) {
  const queryClient = useQueryClient();

  const { data: userData } = useQuery([get.key, post.userId], () =>
    get(post.userId)
  );
  const { mutateAsync: destroyAsync } = useMutation(async () => {
    await destroy({ postId: post.entityId });
    queryClient.invalidateQueries(getList.key);
  });
  const { data: session } = useSession();

  if (!userData) return null;

  return (
    <Box w="100%" borderBottom="1px solid white" padding="16px 16px">
      <HStack alignItems="flex-start">
        <Link
          display="inline-block"
          href={`/profiles/${post.userId}`}
          _hover={{ textDecoration: "non" }}
        >
          <Avatar name={userData.username} size="md" zIndex={-1} />
        </Link>
        <VStack alignItems="flex-start" w="100%">
          <HStack justifyContent="space-between" w="100%">
            <HStack>
              <Link display="inline-block" href={`/profiles/${post.userId}`}>
                <Text fontWeight="bold">{userData?.userHandle}</Text>
              </Link>
              <Text>
                {humanizeDuration(Date.now() - post.createdAt.getTime(), {
                  largest: 1,
                  round: true,
                  units: ["y", "mo", "w", "d", "h", "m"],
                })}
              </Text>
            </HStack>
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<Icon as={BsThreeDots} />}
                variant="ghost"
                disabled={session?.user.id !== post.userId}
              >
                Actions
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => destroyAsync()}>
                  <DeleteIcon mr="12px" color="red" />
                  <span>Delete</span>
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
          <Text>{post.body}</Text>
        </VStack>
      </HStack>
    </Box>
  );
}

type Props = {
  post: Post;
};
