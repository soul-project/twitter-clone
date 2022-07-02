import React from "react";
import { Box, Link, Text } from "@chakra-ui/react";
import { useQuery } from "react-query";

import { get } from "src/modules/users/get";
import { Post } from "src/modules/posts/getList";

export default function PostCard({ post }: Props) {
  const { data } = useQuery([get.key, post.userId], () => get(post.userId));

  if (!data) return null;

  return (
    <Box w="100%" borderBottom="1px solid white" padding="16px 16px">
      {/* TODO: Add created at time as well */}
      <Link display="inline-block">
        <Text fontWeight="bold">{data?.userHandle}</Text>
      </Link>
      {/* <Text>
        The IRCC Social Media team will not respond to any questions sent from
        now until July 4th. Please hold your questions until Monday at 9 am EDT.
        Thanks for understanding!
      </Text> */}
      <Text>{post.body}</Text>
    </Box>
  );
}

type Props = {
  post: Post;
};
