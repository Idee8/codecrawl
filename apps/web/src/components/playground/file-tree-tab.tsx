import { Button, Flex, Text, TextArea, TextField } from '@radix-ui/themes';
import { useState } from 'react';
import { toast } from 'sonner';
import { useCopyToClipboard } from 'usehooks-ts';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';

import { codecrawl } from '~/lib/codecrawl';
import { usePlaygroundSettingsStore } from '~/store/use-playground-settings';

export function FileTreeTab() {
  const [fileTree, setFileTree] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [, copy] = useCopyToClipboard();
  const { setGithubUrl, githubUrl } = usePlaygroundSettingsStore();

  const generateFileTree = async () => {
    setIsFetching(true);
    const response = await codecrawl.generateFileTree(githubUrl);
    if ('data' in response && response.success) {
      setFileTree(response.data.tree);
    }
    setIsFetching(false);
  };

  const copyFileTree = () => {
    copy(fileTree)
      .then(() => {
        toast.success('File tree copied to clipboard');
      })
      .catch(() => {
        toast.error('Failed to copy file tree to clipboard');
      });
  };

  return (
    <div>
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
              onClick={generateFileTree}
            >
              {isFetching ? 'Generating...' : 'Generate'}
            </Button>
          </Flex>
        </label>
      </Flex>
      <Flex direction="column" gap="3" className="mt-4">
        {!!fileTree && (
          <div className="flex justify-end">
            <Button variant="outline" onClick={copyFileTree}>
              <ClipboardDocumentIcon className="w-4 h-4" />
            </Button>
          </div>
        )}
        <TextArea
          value={fileTree}
          className="mt-4"
          rows={20}
          readOnly
          placeholder="File tree will appear here"
        />
      </Flex>
    </div>
  );
}
