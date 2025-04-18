import { Flex } from '@radix-ui/themes';
import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { CTA } from '~/components/marketing/cta';
import { FAQ } from '~/components/marketing/faq';
import { Footer } from '~/components/marketing/footer';
import { Header } from '~/components/marketing/header';
import { Hero } from '~/components/marketing/hero';
import { Pricing } from '~/components/marketing/pricing';

export const getGithubStars = createServerFn({
  method: 'GET',
}).handler(async () => {
  // const response = await fetch('https://api.github.com/repos/Idee8/codecrawl');
  // const data = await response.json();
  // return data.stargazers_count;
  return 2343;
});

export const Route = createFileRoute('/(marketing)/')({
  component: Home,
  loader: async () => {
    const stars = await getGithubStars();
    return { stars };
  },
});

function Home() {
  const state = Route.useLoaderData();

  return (
    <Flex
      direction={'column'}
      height={'100%'}
      flexGrow={'1'}
      style={{ backgroundColor: 'white' }}
    >
      <Header stars={state.stars} />
      <div className="custom-container space-y-12 pt-16 min-h-screen flex flex-col justify-between">
        <main className="flex-1">
          <div className="max-w-3xl mx-auto py-0 sm:py-16">
            <Hero />
            <Pricing />
            <CTA />
            <FAQ />
            <Footer />
          </div>
        </main>
      </div>
    </Flex>
  );
}
