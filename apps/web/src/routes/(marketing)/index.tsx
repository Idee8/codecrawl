import { Flex } from '@radix-ui/themes';
import { createFileRoute } from '@tanstack/react-router';
import { CTA } from '~/components/marketing/cta';
import { FAQ } from '~/components/marketing/faq';
import { Footer } from '~/components/marketing/footer';
import { Header } from '~/components/marketing/header';
import { Hero } from '~/components/marketing/hero';
import { Pricing } from '~/components/marketing/pricing';

export const Route = createFileRoute('/(marketing)/')({
  component: Home,
});

function Home() {
  return (
    <Flex direction={'column'}>
      <Header />
      <Hero />
      <Pricing />
      <CTA />
      <FAQ />
      <Footer />
    </Flex>
  );
}
