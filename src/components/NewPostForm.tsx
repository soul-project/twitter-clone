import React from "react";
import {
  FormControl,
  Input,
  FormErrorMessage,
  Button,
  HStack,
  Box,
  Avatar,
} from "@chakra-ui/react";
import { Formik, Form, Field, FieldInputProps, FormikProps } from "formik";
import { useMutation } from "react-query";
import * as Yup from "yup";
import { useSession } from "next-auth/react";

import { create, CreateArgs } from "src/modules/posts/create";

export default function NewPostForm() {
  const { mutateAsync } = useMutation<void, void, CreateArgs>((value) =>
    create(value)
  );
  const { data: session } = useSession();

  return (
    <Box padding="16px" borderBottom="1px solid white" w="100%">
      <Formik
        initialValues={{ body: "" }}
        onSubmit={async (values, actions) => {
          await mutateAsync(values);
          actions.resetForm();
          actions.setSubmitting(false);
        }}
        validationSchema={Yup.object({ body: Yup.string().required() })}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {(props) => (
          <Form>
            <HStack>
              <Avatar name={session?.user.username} />
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
                    <Input
                      {...field}
                      id="body"
                      placeholder="What's happening?"
                      disabled={props.isSubmitting || !session}
                    />
                    <FormErrorMessage>{form.errors.body}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Button
                mt={4}
                colorScheme="teal"
                isLoading={props.isSubmitting}
                disabled={!session}
                type="submit"
              >
                Submit
              </Button>
            </HStack>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
