import { Button, Flex, Text, TextArea, TextField } from '@radix-ui/themes';
import { useState } from 'react';
import { toast } from 'sonner';
import { useCopyToClipboard } from 'usehooks-ts';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';

import { codecrawl } from '~/lib/codecrawl';
import { usePlaygroundSettingsStore } from '~/store/use-playground-settings';

export function LLMsTxtTab() {
  const [llmstxt, setLLMsTxt] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);
  const { setGithubUrl, githubUrl, getCrawlOptions } =
    usePlaygroundSettingsStore();
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
        <TextArea
          value={llmstxt}
          className="mt-4"
          rows={20}
          readOnly
          placeholder="LLMs.txt will appear here"
        />
      </Flex>
    </div>
  );
}
