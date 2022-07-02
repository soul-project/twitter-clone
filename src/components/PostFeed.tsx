import React from "react";
import { Text, VStack } from "@chakra-ui/react";
import { useQuery } from "react-query";

import { getList } from "src/modules/posts/getList";

import Card from "./PostFeed/Card";

export default function PostFeed() {
  // TODO: add use query infinite here
  const { data, isFetching } = useQuery([getList.key], () => getList());

  if (!data || isFetching) return <Text>loading...</Text>;

  return (
    <VStack w="100%" spacing="0px">
      {data?.posts.map((post) => (
        <Card key={post.entityId} post={post} />
      ))}
    </VStack>
  );
}
