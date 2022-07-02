import React from "react";
import { Text, VStack } from "@chakra-ui/react";
import { useQuery } from "react-query";

import { getList } from "src/modules/posts/getList";

import PostCard from "./PostCard";

export default function PostFeed() {
  const { data, isFetching } = useQuery([getList.key], () => getList());

  if (!data || isFetching) return <Text>loading...</Text>;

  return (
    <VStack w="100%" spacing="0px">
      {data?.posts.map((post) => (
        <PostCard key={post.entityId} post={post} />
      ))}
    </VStack>
  );
}
