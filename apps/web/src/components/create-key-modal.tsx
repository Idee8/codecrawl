import { PlusIcon } from '@heroicons/react/24/outline';
import { Dialog, Button, Flex, TextField, Text } from '@radix-ui/themes';

export function CreateKeyModal() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>
          <PlusIcon className="w-4 h-4" /> Create Key
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>New Key</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Create a new API key to use Codecrawl in your applications.
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Name
            </Text>
            <Flex gap="2">
              <TextField.Root placeholder="My Key" className="flex-1" />
            </Flex>
          </label>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Button>Create</Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
