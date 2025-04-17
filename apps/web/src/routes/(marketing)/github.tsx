import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(marketing)/github')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(marketing)/github"!</div>;
}
