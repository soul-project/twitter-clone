import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useInfiniteQuery } from "react-query";
import {
  VStack,
  Avatar,
  HStack,
  Text,
  Link,
  Box,
  Button,
} from "@chakra-ui/react";

import {
  ConnectionType,
  getMyConnections,
  NUM_ITEMS_PER_PAGE,
} from "src/modules/userConnections/getMyConnections";

import FollowButton from "./FollowButton";

export default function FollowingList({ connectionType }: Props) {
  const { data: session } = useSession();

  const { data, isFetching, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery(
      [getMyConnections.key, { session, connectionType }],
      ({ pageParam = 1 }) =>
        getMyConnections({
          page: pageParam,
          session: session!,
          connectionType,
        }),
      {
        getNextPageParam: ({ totalCount }, pages) => {
          const userConnections = pages.flatMap((page) => page.userConnections);
          if (userConnections.length >= totalCount) {
            return undefined;
          }
          return Math.ceil(userConnections.length / NUM_ITEMS_PER_PAGE) + 1;
        },
        refetchOnWindowFocus: false,
        enabled: !!session,
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
    <VStack w="100%">
      {data && (
        <VStack w="100%" spacing="0px" minW="0px">
          {data.pages
            .flatMap((page) => page.userConnections)
            .map((userConnection) => (
              <HStack
                key={userConnection.id}
                padding="16px"
                justifyContent="space-between"
                w="100%"
                borderBottom="1px solid var(--chakra-colors-border-gray)"
                minW="0px"
              >
                <Link
                  _hover={{ textDecoration: "none" }}
                  href={`/profiles/${userConnection.userId}`}
                  flexShrink={1}
                  overflow="hidden"
                >
                  <HStack>
                    <Avatar name={userConnection.username} />
                    <Text
                      _hover={{ textDecoration: "underline" }}
                      whiteSpace="nowrap"
                      textOverflow="ellipsis"
                      overflow="hidden"
                    >
                      {userConnection.userHandle}
                    </Text>
                  </HStack>
                </Link>
                <Box flexShrink={0}>
                  <FollowButton
                    userId={userConnection.userId}
                    session={session!}
                  />
                </Box>
              </HStack>
            ))}
          <Box padding="16px">
            <Button
              onClick={() => fetchNextPage()}
              isLoading={isFetchingNextPage || isFetching || !data}
              variant="link"
            >
              {hasNextPage ? "Load more..." : "Nothing else to show here 🎉"}
            </Button>
          </Box>
        </VStack>
      )}
    </VStack>
  );
}

type Props = {
  connectionType: ConnectionType;
};
