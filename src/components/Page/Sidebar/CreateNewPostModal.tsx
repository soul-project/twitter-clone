import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Avatar,
  FormControl,
  FormErrorMessage,
  HStack,
  Icon,
  Textarea,
} from "@chakra-ui/react";
import { Formik, Form, Field, FieldInputProps, FormikProps } from "formik";
import { useSession } from "next-auth/react";
import { IoIosSend } from "react-icons/io";
import { useMutation, useQueryClient } from "react-query";
import * as Yup from "yup";
import ResizeTextarea from "react-textarea-autosize";

import { create, CreateArgs } from "src/modules/posts/create";
import { getList } from "src/modules/posts/getList";

export default function CreateNewPostModal({ onCloseCreatePostModal: onClose, isOpenCreatePostModal: isOpen }: Props) {
  const { mutateAsync } = useMutation<void, void, CreateArgs>((value) =>
    create(value)
  );
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent minH={["80vh", "0px"]}>
        <ModalCloseButton />
        <ModalHeader />
        <Formik
          initialValues={{ body: "" }}
          onSubmit={async (values, actions) => {
            await mutateAsync(values);
            await queryClient.invalidateQueries(getList.key);
            actions.resetForm();
            actions.setSubmitting(false);
            onClose();
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
              <ModalBody>
                <HStack spacing="16px">
                  <Avatar
                    name={session?.user.username}
                    alignSelf="flex-start"
                  />
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
                          autoFocus
                        />
                        <FormErrorMessage>{form.errors.body}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </HStack>
              </ModalBody>
              <ModalFooter>
                <Button
                  isLoading={props.isSubmitting}
                  disabled={!session || !props.dirty}
                  type="submit"
                  leftIcon={<Icon as={IoIosSend} />}
                >
                  Post
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
}

type Props = {
  isOpenCreatePostModal: boolean;
  onCloseCreatePostModal: () => void;
};
