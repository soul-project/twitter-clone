import React, { useEffect } from "react";
import { VStack, Button } from "@chakra-ui/react";
import { useInfiniteQuery } from "react-query";

import { getList } from "src/modules/posts/getList";

import Card from "./PostFeed/Card";

export default function PostFeed({ userId }: Props) {
  const { data, isFetching, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery(
      [getList.key, { userId }],
      ({ pageParam = new Date().getTime() }) =>
        getList({ cursor: pageParam, userId }),
      {
        getNextPageParam: (curr) => {
          if (curr.posts.length === 0) return undefined;
          return curr.posts[curr.posts.length - 1].createdAt.getTime();
        },
        refetchOnWindowFocus: false,
      }
    );

  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        Math.ceil(window.innerHeight + window.scrollY) >=
        document.documentElement.scrollHeight;
      if (bottom) {
        fetchNextPage();
      }
    };
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fetchNextPage]);

  const isLoading = isFetchingNextPage || isFetching || !data;

  // TODO: Maybe just have something really creative like a click button to refetch and then
  // let folks know to refresh until they see something here while explaining what's going on
  return (
    <VStack spacing="16px" pb="16px" w="100%">
      {data && (
        <VStack w="100%" spacing="0px">
          {data.pages
            .flatMap((page) => page.posts)
            .map((post) => (
              <Card key={post.entityId} post={post} />
            ))}
        </VStack>
      )}
      <Button
        onClick={() => fetchNextPage()}
        isLoading={isLoading}
        variant="link"
        mt={isLoading ? "16px" : "0px"}
      >
        {hasNextPage ? "Load more..." : "Nothing else to show here 🎉"}
      </Button>
    </VStack>
  );
}

type Props = {
  userId?: number;
};
