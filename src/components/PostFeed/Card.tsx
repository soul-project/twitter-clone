import React from "react";
import { Box, HStack, Link, Text } from "@chakra-ui/react";
import { useQuery } from "react-query";
import humanizeDuration from "humanize-duration";

import { get } from "src/modules/users/get";
import { Post } from "src/modules/posts/getList";

export default function Card({ post }: Props) {
  const { data } = useQuery([get.key, post.userId], () => get(post.userId));

  if (!data) return null;

  return (
    <Box w="100%" borderBottom="1px solid white" padding="16px 16px">
      <HStack>
        <Link display="inline-block" href={`/profiles/${post.userId}`}>
          <Text fontWeight="bold">{data?.userHandle}</Text>
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
    </Box>
  );
}

type Props = {
  post: Post;
};
