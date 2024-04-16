import { ClientsItem } from "@/components/clients-item";
import { NewClientForm } from "@/components/new-client-form";
import { Box, Grid, Title } from "@mantine/core";
import { SKSClient } from "@prisma/client";
import dayjs from "dayjs";

export const ClientsList = ({
  clients,
  userId,
}: {
  clients: SKSClient[];
  userId: string;
}) => {
  const activeClients = clients.filter(
    (client) =>
      !!client.lastActive &&
      dayjs().diff(dayjs(client.lastActive), "minute") < 5
  );
  const inactiveClients = clients.filter(
    (client) =>
      !client.lastActive ||
      dayjs().diff(dayjs(client.lastActive), "minute") >= 5
  );

  return (
    <Box mt="30px">
      <Title>Active clients</Title>
      <Grid
        columns={12}
        mt={30}
        gutter={{ base: 5, xs: "md", md: "xl", xl: 50 }}
        align="stretch"
        justify="stretch"
      >
        <NewClientForm userId={userId} />
        {activeClients.map((client, clientIndex) => (
          <ClientsItem
            client={client}
            clientIndex={clientIndex}
            userId={userId}
          />
        ))}
      </Grid>
      <Title mt="30px">Inactive clients</Title>
      <Grid
        columns={12}
        mt={30}
        gutter={{ base: 5, xs: "md", md: "xl", xl: 50 }}
        align="stretch"
        justify="stretch"
      >
        {inactiveClients.map((client, clientIndex) => (
          <ClientsItem
            client={client}
            clientIndex={clientIndex}
            userId={userId}
          />
        ))}
      </Grid>
    </Box>
  );
};
