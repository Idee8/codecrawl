import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Button, Flex, Table, Text } from '@radix-ui/themes';
import { createFileRoute } from '@tanstack/react-router';
import { seo } from '~/utils/seo';

export const Route = createFileRoute('/app/_app/keys')({
  component: RouteComponent,
  head(ctx) {
    return {
      meta: [...seo({ title: 'API Keys | Codecrawl' })],
    };
  },
});

function RouteComponent() {
  return (
    <Flex direction={'column'} gap={'4'}>
      <Flex justify={'between'} align={'center'}>
        <Flex direction={'column'} gap={'2'}>
          <Text size={'3'} weight={'bold'}>
            API Keys
          </Text>
          <Text size={'2'} color={'gray'} weight={'medium'}>
            Create an API key to use Codecrawl in your applications.
          </Text>
        </Flex>
        <Button>
          <PlusIcon className="w-4 h-4" /> Create Key
        </Button>
      </Flex>

      <Table.Root variant={'surface'}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>API Key</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Created</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.RowHeaderCell>Default</Table.RowHeaderCell>
            <Table.Cell>
              <Text size={'2'} color={'gray'} weight={'medium'}>
                **********
              </Text>
            </Table.Cell>
            <Table.Cell>
              <Text size={'2'} color={'gray'} weight={'medium'}>
                Mon, 17 Apr 2025
              </Text>
            </Table.Cell>
            <Table.Cell>
              <Button variant={'ghost'}>
                <TrashIcon className="w-4 h-4" />
              </Button>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </Flex>
  );
}
