import React from "react";
import {
  Avatar,
  Box,
  HStack,
  Link,
  Text,
  VStack,
  Image,
  Divider,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSession } from "next-auth/react";
import Linkify from "linkify-react";
import styled from "@emotion/styled";

import { get } from "src/modules/users/get";
import { getList, Post } from "src/modules/posts/getList";
import { destroy } from "src/modules/posts/destroy";

import UserActionHeader from "./Card/UserActionHeader";

export default function Card({ post }: Props) {
  const queryClient = useQueryClient();

  const { data: userData } = useQuery([get.key, post.userId], () =>
    get(post.userId)
  );
  const { mutate: destroyPost } = useMutation(async () => {
    await destroy({ postId: post.entityId });
    queryClient.invalidateQueries(getList.key);
  });
  const { data: session } = useSession();

  if (!userData) return null;

  return (
    <Box
      w="100%"
      borderBottom="1px solid var(--chakra-colors-border-gray)"
      padding="16px"
    >
      <HStack alignItems="flex-start">
        <Link
          display="inline-block"
          href={`/profiles/${post.userId}`}
          _hover={{ textDecoration: "none" }}
        >
          <Avatar name={userData.username} size="md" zIndex={-1} />
        </Link>
        <VStack alignItems="flex-start" minW="0px" w="100%">
          <UserActionHeader
            userId={session?.user.id}
            post={post}
            userHandle={userData.userHandle}
            onDestroyPost={destroyPost}
          />
          <BodyText overflowWrap="anywhere" wordBreak="break-word">
            <Linkify
              tagName="p"
              options={{
                target: { url: "_blank" },
              }}
            >
              {post.body}
            </Linkify>
          </BodyText>
          {post.previewMetadata && (
            <Link
              href={post.previewMetadata.url}
              target="_blank"
              _hover={{ textDecoration: "none" }}
              w="100%"
            >
              <VStack
                alignItems="flex-start"
                padding="16px"
                border="1px solid var(--chakra-colors-border-gray)"
                backgroundColor="linkPreview.background"
              >
                <Text>{post.previewMetadata.title}</Text>
                {post.previewMetadata.description && (
                  <>
                    <Divider />
                    <Text>{post.previewMetadata.description}</Text>
                  </>
                )}
                {post.previewMetadata.image && (
                  <>
                    <Divider />
                    <Image
                      src={post.previewMetadata.image}
                      alt={post.previewMetadata.title}
                    />
                  </>
                )}
              </VStack>
            </Link>
          )}
        </VStack>
      </HStack>
    </Box>
  );
}

type Props = {
  post: Post;
};

const BodyText = styled(Text)`
  a {
    text-decoration: underline;
  }
`;
