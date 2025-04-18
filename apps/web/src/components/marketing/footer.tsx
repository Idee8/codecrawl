import { Link } from '@tanstack/react-router';

export function Footer() {
  return (
    <footer>
      <div className="grid sm:grid-cols-12 md:py-12 text-neutral-800">
        <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
          <p>Product</p>
          <ul>
            <li>
              <Link to="/">Home</Link>
              <Link to="/">Home</Link>
              <Link to="/">Home</Link>
              <Link to="/">Home</Link>
              <Link to="/">Home</Link>
            </li>
          </ul>
        </div>
        <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
          <p>Documentation</p>
        </div>
        <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
          <p>Company</p>
        </div>
        <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
          <p>Legal</p>
        </div>
      </div>
    </footer>
  );
}
