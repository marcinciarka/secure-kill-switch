"use client";
import { createUser } from "@/handlers/create-user";
import { Button, Flex, Input, Modal, Text, rem } from "@mantine/core";
import { Form, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { SKSUser } from "@prisma/client";
import { IconUser } from "@tabler/icons-react";
import { useState } from "react";

export const NewUserForm = ({
  onUserCreated,
}: {
  // eslint-disable-next-line no-unused-vars
  onUserCreated: (client: SKSUser) => void;
}) => {
  const createUserForm = useForm({
    initialValues: {
      name: "",
    },
  });
  const [addingUser, setAddingUser] = useState(false);
  const [addNewUserOpened, { open: openAddNewUser, close: closeAddNewUser }] =
    useDisclosure(false);
  const createUserOnSubmit = async () => {
    setAddingUser(true);
    const createUserReply = await createUser(createUserForm.values);
    if (createUserReply.status === 200 && createUserReply.body?.data?.id) {
      onUserCreated(createUserReply.body.data);
    }
    createUserForm.reset();
    closeAddNewUser();
    setAddingUser(false);
  };
  return (
    <>
      <Flex justify="center">
        <Button
          size="lg"
          leftSection={<IconUser style={{ width: rem(14), height: rem(14) }} />}
          onClick={openAddNewUser}
        >
          Add new user
        </Button>
      </Flex>
      <Modal
        centered
        size="auto"
        opened={addNewUserOpened}
        onClose={closeAddNewUser}
        title={
          <Text ff="heading" size="25px">
            Adding a new user
          </Text>
        }
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Form form={createUserForm} onSubmit={createUserOnSubmit}>
          <Flex direction="column">
            <Text size="sm" mb="5px">
              Enter a name for the new user.
              <br />
              If can think of anything, a name will be generated for you.
            </Text>
            <Input
              w="100%"
              mb="20px"
              placeholder="Your (optional) client name"
              value={createUserForm.values.name}
              onChange={(event) =>
                createUserForm.setFieldValue("name", event.currentTarget.value)
              }
            />
            <Button type="submit" loading={addingUser}>
              Create User
            </Button>
          </Flex>
        </Form>
      </Modal>
    </>
  );
};
