import React, { useEffect } from "react";
import { Text, VStack, Button } from "@chakra-ui/react";
import { useInfiniteQuery } from "react-query";

import { getList, NUM_ITEMS_PER_PAGE } from "src/modules/posts/getList";

import Card from "./PostFeed/Card";

export default function PostFeed({ userId }: Props) {
  const { data, isFetching, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      [getList.key, { userId }],
      ({ pageParam = 1 }) => getList({ page: pageParam, userId }),
      {
        getNextPageParam: ({ totalCount }, pages) => {
          const posts = pages.flatMap((page) => page.posts);
          if (posts.length >= totalCount) {
            return undefined;
          }
          return Math.ceil(posts.length / NUM_ITEMS_PER_PAGE) + 1;
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
        isLoading={isFetchingNextPage || isFetching}
        variant="link"
      >
        Load more...
      </Button>
    </VStack>
  );
}

type Props = {
  userId?: number;
};
