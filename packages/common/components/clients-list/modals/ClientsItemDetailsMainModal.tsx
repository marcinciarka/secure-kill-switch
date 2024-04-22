"use client";
import { Badge, CopyButton, Divider, Flex, Modal, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCopy } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useMemo } from "react";
import { ClientsItemDetailsModalButtons } from "../../../components";
import { ClientIcon } from "../../../components/ClientIcon";
import { modalLayers, timeAgo } from "../../../helpers";
import { ClientWithActions } from "../../../types";

export const ClientsItemDetailsMainModal = ({
  client,
  userId,
  clientModalOpened,
  closeClientModal,
  openClientRenameModal,
  openClientNotificationModal,
}: {
  client: ClientWithActions;
  userId: string;
  clientModalOpened: boolean;
  closeClientModal: () => void;
  openClientRenameModal: () => void;
  openClientNotificationModal: () => void;
}) => {
  const actionsInfo = useMemo(() => {
    if (!client.actions.length) return "No actions";
    const actions: string[] = ["Actions: "];
    const pendingActions = client.actions?.filter(
      (action) => !action.isExecuted
    );
    const executedActions = client.actions?.filter(
      (action) => action.isExecuted
    );
    if (pendingActions?.length) {
      actions.push(`${pendingActions.length} pending`);
    }
    if (executedActions?.length) {
      actions.push(`${executedActions.length} executed`);
    }
    return actions.length > 2 ? actions.join(", ") : actions.join("");
  }, [client.actions]);
  const isActive =
    !!client.lastActive && dayjs().diff(dayjs(client.lastActive), "minute") < 5;

  return (
    <Modal
      centered
      size="auto"
      opened={clientModalOpened}
      onClose={closeClientModal}
      title={
        <Text ff="heading" size="25px">
          {client.name}
        </Text>
      }
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      zIndex={modalLayers.first}
    >
      <Flex
        direction={{
          base: "column",
          lg: "row",
        }}
        align="center"
      >
        <ClientIcon
          active={isActive}
          icon={client.icon}
          iconProps={{
            size: "100px",
            strokeWidth: 1,
          }}
        />
        <Flex
          direction="column"
          maw="100%"
          mt={{
            base: "30px",
            lg: 0,
          }}
          ml={{
            base: 0,
            lg: "20px",
          }}
        >
          <CopyButton value={client.id}>
            {({ copied, copy }) => (
              <Badge
                style={{
                  textTransform: "none",
                  cursor: "pointer",
                  userSelect: "none",
                  maxWidth: "100%",
                }}
                onClick={() => {
                  !copied &&
                    notifications.show({
                      title: "Client ID copied",
                      message: "Now you can paste it in the desktop app",
                      color: "teal",
                    });
                  !copied && copy();
                }}
                color={copied ? "teal" : undefined}
                size="xl"
                variant="light"
                mb="10px"
                rightSection={
                  <IconCopy size="16px" style={{ marginLeft: "5px" }} />
                }
              >
                {client.id}
              </Badge>
            )}
          </CopyButton>
          <Flex>
            <Badge
              style={{
                textTransform: "none",
                userSelect: "none",
                maxWidth: "100%",
              }}
              w={{
                base: "100%",
                lg: "fit-content",
              }}
              mr="10px"
              size="xl"
              variant="light"
              title={`${client.lastActive?.toLocaleDateString()} ${client.lastActive?.toLocaleTimeString()}`}
            >
              {timeAgo(client.lastActive)}
            </Badge>
            <Badge
              style={{
                textTransform: "none",
                userSelect: "none",
                maxWidth: "100%",
              }}
              w={{
                base: "100%",
                lg: "fit-content",
              }}
              size="xl"
              variant="light"
            >
              {actionsInfo}
            </Badge>
          </Flex>
        </Flex>
      </Flex>
      <Divider mt="20px" mb="20px" />
      <ClientsItemDetailsModalButtons
        client={client}
        userId={userId}
        closeClientModal={closeClientModal}
        openClientRenameModal={openClientRenameModal}
        openClientNotificationModal={openClientNotificationModal}
      />
    </Modal>
  );
};