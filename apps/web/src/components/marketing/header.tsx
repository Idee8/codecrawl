import { Button } from '@radix-ui/themes';
import { SvgLogoBlack, SvgGithubLogo } from '../svgs';
import { useScroll } from '~/hooks/use-scroll';
import { cn } from '~/utils/classnames';
import { kFormatter } from '~/utils/k-formatter';
import { Link } from '@tanstack/react-router';

export function Header({ stars }: { stars: number }) {
  const scrolled = useScroll(10);
  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-white pt-5 pb-2 transition-all duration-100',
        {
          'border-b border-neutral-100': scrolled,
        },
      )}
    >
      <div className="grid md:grid-cols-5 grid-cols-2 w-full relative custom-container">
        <Link to="/" className="flex items-center justify-start gap-2.5">
          <SvgLogoBlack />
          <span className="text-base font-semibold text-neutral-900">
            Codecrawl
          </span>
        </Link>
        <div className="gap-8 col-span-3 hidden md:flex justify-center text-neutral-900 font-medium">
          <Link to="/playground">Playground</Link>
          <a href="https://docs.codecrawl.com" target="_blank">
            Docs
          </a>
          <Link to="/blog">Blog</Link>
          <Link to="/updates">Updates</Link>
        </div>
        <div className="flex gap-4 justify-end relative items-center">
          <a
            href={'https://github.com/Idee8/codecrawl'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-900 flex items-center gap-3"
          >
            <SvgGithubLogo className="w-4 h-4" />
            {kFormatter(stars)}
          </a>
          <Button>Sign In</Button>
        </div>
      </div>
    </header>
  );
}
