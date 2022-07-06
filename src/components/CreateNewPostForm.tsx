import React from "react";
import {
  FormControl,
  Input,
  FormErrorMessage,
  Button,
  HStack,
  Box,
  Avatar,
  Textarea,
  Icon,
} from "@chakra-ui/react";
import { Formik, Form, Field, FieldInputProps, FormikProps } from "formik";
import { useMutation, useQueryClient } from "react-query";
import * as Yup from "yup";
import { useSession } from "next-auth/react";
import { IoIosSend } from "react-icons/io";
import ResizeTextarea from "react-textarea-autosize";

import { create, CreateArgs } from "src/modules/posts/create";
import { getList } from "src/modules/posts/getList";

export default function CreateNewPostForm() {
  const { mutateAsync } = useMutation<void, void, CreateArgs>((value) =>
    create(value)
  );
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return (
    <Box
      padding="16px"
      borderBottom="1px solid var(--chakra-colors-border-gray)"
      w="100%"
    >
      <Formik
        initialValues={{ body: "" }}
        onSubmit={async (values, actions) => {
          await mutateAsync(values);
          actions.resetForm();
          actions.setSubmitting(false);
          queryClient.invalidateQueries(getList.key);
        }}
        validationSchema={Yup.object({
          body: Yup.string()
            .required("Post body is required")
            .max(255, "Must be 255 characters or less"),
        })}
        validateOnChange={true}
        validateOnBlur={false}
      >
        {(props) => (
          <Form>
            <HStack spacing="16px">
              <Avatar name={session?.user.username} alignSelf="flex-start" />
              <Field name="body">
                {({
                  field,
                  form,
                }: {
                  field: FieldInputProps<string>;
                  form: FormikProps<{ body: string }>;
                }) => (
                  <FormControl
                    isInvalid={!!form.errors.body && form.touched.body}
                  >
                    <Textarea
                      {...field}
                      id="body"
                      placeholder="What's happening?"
                      disabled={props.isSubmitting || !session}
                      minH="unset"
                      overflow="hidden"
                      resize="none"
                      as={ResizeTextarea}
                      onKeyDown={(e) => {
                        if (e.metaKey && e.code === "Enter") {
                          props.submitForm();
                        }
                      }}
                      variant="flushed"
                    />
                    <FormErrorMessage>{form.errors.body}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </HStack>
            <HStack justifyContent="flex-end" mt="8px">
              <Button
                isLoading={props.isSubmitting}
                disabled={!session || !props.dirty}
                type="submit"
                leftIcon={<Icon as={IoIosSend} />}
              >
                Post
              </Button>
            </HStack>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
