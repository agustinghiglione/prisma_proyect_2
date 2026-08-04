import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV_ITEMS, NAV_CTA } from '../data/nav';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState('#inicio');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = [...NAV_ITEMS.map((i) => i.href), NAV_CTA.href];
    const sections = ids
      .map((id) => document.querySelector(id))
      .filter((el): el is Element => !!el);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-background/90 backdrop-blur-md shadow-[0_1px_0_0_var(--color-border)]' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <a
          href="#inicio"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#inicio');
          }}
          className="font-heading text-lg font-extrabold tracking-tight text-primary"
        >
          PRISMA <span className="font-medium text-primary">CONSULTORA</span>
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.href);
              }}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                active === item.href ? 'text-primary' : 'text-ink-soft'
              }`}
            >
              {item.label}
            </a>
          ))}
          <button
            onClick={() => handleNavClick(NAV_CTA.href)}
            className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-primary-dark shadow-soft transition-all hover:brightness-95"
          >
            {NAV_CTA.label}
          </button>
        </div>

        <button
          className="text-primary lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border bg-background px-6 py-6 lg:hidden">
          <div className="flex flex-col gap-5">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className="text-base font-medium text-ink"
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={() => handleNavClick(NAV_CTA.href)}
              className="rounded-full bg-gold px-5 py-3 text-sm font-semibold text-primary-dark"
            >
              {NAV_CTA.label}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
