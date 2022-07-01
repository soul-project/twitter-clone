import React from "react";
import {
  FormControl,
  Input,
  FormErrorMessage,
  Button,
  HStack,
} from "@chakra-ui/react";
import { Formik, Form, Field, FieldInputProps, FormikProps } from "formik";
import { useMutation } from "react-query";
import * as Yup from "yup";

import { create, CreateArgs } from "src/modules/posts/create";

export default function NewPostForm() {
  const { mutateAsync } = useMutation<void, void, CreateArgs>((value) =>
    create(value)
  );

  return (
    <Formik
      initialValues={{ body: "" }}
      onSubmit={async (values, actions) => {
        await mutateAsync(values);
        actions.resetForm();
        actions.setSubmitting(false);
      }}
      validationSchema={Yup.object({ body: Yup.string().required() })}
      validateOnChange={false}
    >
      {(props) => (
        <Form>
          <HStack alignItems="flex-start">
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
                    disabled={props.isSubmitting}
                  />
                  <FormErrorMessage>{form.errors.body}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={props.isSubmitting}
              type="submit"
            >
              Submit
            </Button>
          </HStack>
        </Form>
      )}
    </Formik>
  );
}
