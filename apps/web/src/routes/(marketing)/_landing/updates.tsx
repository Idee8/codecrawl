import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(marketing)/_landing/updates')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(marketing)/updates"!</div>;
}
