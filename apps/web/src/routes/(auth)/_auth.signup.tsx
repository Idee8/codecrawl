import { LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import {
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  Text,
  TextField,
} from '@radix-ui/themes';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Logo } from '~/components/logo';

export const Route = createFileRoute('/(auth)/_auth/signup')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Box className="max-w-md">
      <Card size="1" className="p-4" variant="classic">
        <Flex direction="column" gap="5" p={'4'}>
          <Flex direction="column" gap="2">
            <Avatar fallback={<Logo />} color="gray" mb={'4'} />
            <Text size={'5'} weight={'medium'}>
              Sign up for a new account
            </Text>
            <Text size={'2'} color={'gray'}>
              Already a member?{' '}
              <Link to="/signin">
                <Text as={'span'} color={'gray'} className="underline">
                  Sign in
                </Text>
              </Link>
            </Text>
          </Flex>
          <label>
            <Text size={'2'} weight={'medium'}>
              Email
            </Text>
            <TextField.Root placeholder="Enter your email" size="3" mt={'2'}>
              <TextField.Slot>
                <EnvelopeIcon height="16" width="16" />
              </TextField.Slot>
            </TextField.Root>
          </label>
          <Box>
            <Flex align={'center'} pr={'1'} justify={'between'}>
              <Text size={'2'} weight={'medium'}>
                Password
              </Text>
              <Text as={'span'} size="2" color={'gray'} className="underline">
                Forgot password?
              </Text>
            </Flex>
            <TextField.Root
              placeholder="Enter your password"
              size="3"
              mt={'2'}
              type="password"
            >
              <TextField.Slot>
                <LockClosedIcon height="16" width="16" />
              </TextField.Slot>
            </TextField.Root>
          </Box>
          <Text size={'1'} color={'gray'} weight={'medium'}>
            By joining, you agree to our{' '}
            <Text as={'span'} color={'gray'} className="underline">
              Terms and Privacy
            </Text>
            .
          </Text>
          <Button size={'3'}>Sign in</Button>
        </Flex>
      </Card>
    </Box>
  );
}
