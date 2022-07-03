import React from "react";
import { Avatar, Box, HStack, Link, Text, VStack } from "@chakra-ui/react";
import { useQuery } from "react-query";
import humanizeDuration from "humanize-duration";

import { get } from "src/modules/users/get";
import { Post } from "src/modules/posts/getList";

export default function Card({ post }: Props) {
  const { data: userData } = useQuery([get.key, post.userId], () =>
    get(post.userId)
  );
  // TODO: Add ability to delete the card, and make it so that the
  // user can't delete cards they do not own.

  if (!userData) return null;

  return (
    <Box w="100%" borderBottom="1px solid white" padding="16px 16px">
      <HStack alignItems="flex-start">
        <Link
          display="inline-block"
          href={`/profiles/${post.userId}`}
          _hover={{ textDecoration: "non" }}
        >
          <Avatar name={userData.username} size="md" />
        </Link>
        <VStack alignItems="flex-start">
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
          <Text>{post.body}</Text>
        </VStack>
      </HStack>
    </Box>
  );
}

type Props = {
  post: Post;
};
