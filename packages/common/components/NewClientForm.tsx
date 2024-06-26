"use client";
import { Box, Button, Chip, Flex, Modal, Text, TextInput } from "@mantine/core";
import { Form, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { SKSClient } from "@sks/database";
import { IconCheck, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { createClient, revalidateCachePath } from "../handlers";
import {
  ClientIconsNames,
  clientIcons,
  modalLayers,
  shortenId,
} from "../helpers";

export const NewClientForm = ({ userId }: { userId: string }) => {
  const [
    addNewClientOpened,
    { open: openAddNewClient, close: closeAddNewClient },
  ] = useDisclosure(false);
  const [selectedClientIcon, setSelectedClientIcon] =
    useState<ClientIconsNames>(Object.keys(clientIcons)[0] as ClientIconsNames);
  const [addingClient, setAddingClient] = useState(false);
  const onClientCreated = (client: SKSClient) => {
    notifications.show({
      title: "Client created",
      message: client.name
        ? `Client ${shortenId(client.id)} created with name ${client.name}`
        : `Client ${shortenId(client.id)} created`,
      color: "teal",
    });
    revalidateCachePath(`/user/${userId}`);
  };
  const createClientForm = useForm({
    initialValues: {
      name: "",
    },
    validate: {
      name: (value) => {
        if (value.length > 30) {
          return "Name is too long";
        }
        return null;
      },
    },
  });
  const createClientOnSubmit = async () => {
    setAddingClient(true);
    const createClientReply = await createClient({
      name: createClientForm.values.name,
      userId,
      icon: selectedClientIcon,
    });
    if (createClientReply.status === 200 && createClientReply.body?.data?.id) {
      closeAddNewClient();
      setAddingClient(false);
      onClientCreated(createClientReply.body.data);
      createClientForm.reset();
    }
  };
  return (
    <Box key="new-client-form">
      <Button
        color="teal"
        leftSection={<IconPlus size={24} />}
        onClick={openAddNewClient}
      >
        Add new client
      </Button>
      <Modal
        centered
        size="auto"
        opened={addNewClientOpened}
        onClose={closeAddNewClient}
        title={
          <Text ff="heading" size="25px">
            Adding a new client
          </Text>
        }
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        zIndex={modalLayers.first}
      >
        <Form form={createClientForm} onSubmit={createClientOnSubmit}>
          <Flex direction="column">
            <Text size="sm" mb="5px">
              You can specify a clients display name and pick an icon.
            </Text>
            <TextInput
              w="100%"
              mb="20px"
              placeholder="Your (optional) client name"
              {...createClientForm.getInputProps("name")}
            />
            <Flex
              p="lg"
              mb="lg"
              bg="dark.6"
              style={{ borderRadius: "4px" }}
              justify="space-evenly"
            >
              {Object.keys(clientIcons).map((client) => (
                <Chip
                  key={client}
                  variant="outline"
                  style={{
                    marginRight: "5px",
                    opacity: client === selectedClientIcon ? 1 : 0.3,
                  }}
                  icon={
                    <IconCheck
                      size="14px"
                      strokeWidth={client === selectedClientIcon ? 5 : 1}
                      color={client === selectedClientIcon ? undefined : "gray"}
                    />
                  }
                  checked={true}
                  onClick={() =>
                    setSelectedClientIcon(client as ClientIconsNames)
                  }
                >
                  {clientIcons[client as ClientIconsNames]}
                </Chip>
              ))}
            </Flex>
            <Button type="submit" loading={addingClient}>
              Create Client
            </Button>
          </Flex>
        </Form>
      </Modal>
    </Box>
  );
};
