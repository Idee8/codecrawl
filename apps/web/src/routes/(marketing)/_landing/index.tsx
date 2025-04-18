import { createFileRoute } from '@tanstack/react-router';
import { CTA } from '~/components/marketing/cta';
import { FAQ } from '~/components/marketing/faq';
import { Footer } from '~/components/marketing/footer';
import { Hero } from '~/components/marketing/hero';
import { Pricing } from '~/components/marketing/pricing';

export const Route = createFileRoute('/(marketing)/_landing/')({
  component: Home,
});

function Home() {
  return (
    <div className="max-w-3xl mx-auto py-0 sm:py-16">
      <Hero />
      <Pricing />
      <CTA />
      <FAQ />
      <Footer />
    </div>
  );
}
