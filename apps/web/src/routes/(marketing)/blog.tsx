import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(marketing)/blog')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(marketing)/blog"!</div>;
}
