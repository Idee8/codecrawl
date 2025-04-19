import { Flex, Text, Box } from '@radix-ui/themes';
import { Tabs } from '@radix-ui/themes';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(marketing)/_landing/playground')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Flex direction={'column'} gap={'4'}>
      <Flex justify={'between'} align={'center'}>
        <Flex direction={'column'} gap={'2'}>
          <Text size={'7'} weight={'medium'} className="text-neutral-800">
            Playground
          </Text>
          <Text
            size={'3'}
            color={'gray'}
            weight={'medium'}
            className="text-neutral-500"
          >
            Try out Codecrawl in this visual playground
          </Text>
        </Flex>
      </Flex>
      <Flex direction={'column'} gap={'4'}>
        <Tabs.Root defaultValue="llms" className="w-full !text-neutral-800">
          <Tabs.List>
            <Tabs.Trigger value="llms" className="text-neutral-800">
              LLMs.txt
            </Tabs.Trigger>
            <Tabs.Trigger value="filetree" className="text-neutral-800">
              File Tree
            </Tabs.Trigger>
            <Tabs.Trigger value="settings" className="text-neutral-800">
              Settings
            </Tabs.Trigger>
          </Tabs.List>

          <Box pt="3">
            <Tabs.Content value="llms">
              <Text size="2">Make changes to your account.</Text>
            </Tabs.Content>

            <Tabs.Content value="filetree">
              <Text size="2">Access and update your documents.</Text>
            </Tabs.Content>

            <Tabs.Content value="settings">
              <Text size="2">
                Edit your profile or update contact information.
              </Text>
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </Flex>
    </Flex>
  );
}
