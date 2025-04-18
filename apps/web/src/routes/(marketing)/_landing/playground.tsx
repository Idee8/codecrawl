import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(marketing)/_landing/playground')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(marketing)/_landing/playground"!</div>;
}
