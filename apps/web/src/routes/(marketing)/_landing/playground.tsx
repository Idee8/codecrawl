import { Flex, Text, Box, TextField, Button } from '@radix-ui/themes';
import { Tabs } from '@radix-ui/themes';
import { createFileRoute } from '@tanstack/react-router';
import { FileTreeTab } from '~/components/playground/file-tree-tab';
import { SettingsTab } from '~/components/playground/settings-tab';
import { usePlaygroundSettingsStore } from '~/store/use-playground-settings';
import { useState } from 'react';
import { codecrawl } from '~/lib/codecrawl';
import { useCopyToClipboard } from 'usehooks-ts';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

export const Route = createFileRoute('/(marketing)/_landing/playground')({
  component: RouteComponent,
});

function RouteComponent() {
  const { setGithubUrl, githubUrl, getCrawlOptions } =
    usePlaygroundSettingsStore();
  const [llmstxt, setLLMsTxt] = useState('');
  const [fileTree, setFileTree] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [, copy] = useCopyToClipboard();

  const generateLLMsTxt = async () => {
    setIsFetching(true);
    const response = await codecrawl.generateLLMsTxt(githubUrl, {
      showFullText: true,
      ...getCrawlOptions(),
    });
    if ('data' in response && response.success) {
      setLLMsTxt(response.data.llmstxt);
    }
    setIsFetching(false);
  };

  const copyLLMsTxt = () => {
    copy(llmstxt)
      .then(() => {
        toast.success('LLMs.txt copied to clipboard');
      })
      .catch(() => {
        toast.error('Failed to copy LLMs.txt to clipboard');
      });
  };

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
              <Flex direction="column" gap="3">
                <label>
                  <Text as="div" size="2" mb="1" weight="bold">
                    Github URL
                  </Text>
                  <Flex gap="2">
                    <TextField.Root
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      className="flex-1"
                      size={'2'}
                      placeholder="https://github.com/username/repo"
                    />
                    <Button
                      variant="solid"
                      disabled={isFetching}
                      onClick={generateLLMsTxt}
                    >
                      {isFetching ? 'Generating...' : 'Generate'}
                    </Button>
                  </Flex>
                </label>
              </Flex>
              <Flex direction="column" gap="3" className="mt-4">
                {!!llmstxt && (
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={copyLLMsTxt}>
                      <ClipboardDocumentIcon className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                <textarea
                  value={llmstxt}
                  className="mt-4 !text-neutral-800 bg-neutral-100 !placeholder:text-neutral-400 p-2 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={20}
                  readOnly
                  placeholder="LLMs.txt will appear here"
                />
              </Flex>
            </Tabs.Content>

            <Tabs.Content value="filetree">
              <FileTreeTab />
            </Tabs.Content>

            <Tabs.Content value="settings">
              <SettingsTab />
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </Flex>
    </Flex>
  );
}
