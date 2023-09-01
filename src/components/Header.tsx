import "./Header.scss";

import clsx from "clsx";
import { observer } from "mobx-react-lite";
import React from "react";
import { Link, useLocation } from "wouter";

const Header = observer(function Header() {
  const [location, _] = useLocation();

  return (
    <header className="Header">
      <nav className={clsx({ expanded: location === "/" })}>
        <VisitableLink href="/" className="home">
          {(visiting) => (visiting ? <Logo /> : <Home />)}
        </VisitableLink>

        <div className="links">
          <div className="external">
            <a
              className="ko-fi"
              title="Ko-fi"
              href="https://ko-fi.com/alostsock"
              target="_blank"
              rel="noreferrer"
            >
              <img src="/ko-fi.webp" alt="Buy Me a Coffee at ko-fi.com" />
            </a>
            <a
              className="discord"
              title="Discord"
              href="https://discord.gg/sKC4VxeMjY"
              target="_blank"
              rel="noreferrer"
            >
              <img src="/discord.svg" alt="Join the Discord server" />
            </a>
            <a
              className="github"
              title="Github"
              href="https://github.com/alostsock/craftingway"
              target="_blank"
              rel="noreferrer"
            >
              <img src="/github.svg" alt="Github repository" />
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
});

export default Header;

interface VisitableLinkProps {
  href: string;
  children: ((visiting: boolean) => React.ReactNode) | React.ReactNode;
  className?: string;
}

// Renders a link if the current URL doesnt match `href`; otherwise, a div.
const VisitableLink = ({ href, children, className }: VisitableLinkProps) => {
  const [location, _] = useLocation();
  const visiting = location === href;
  const label = typeof children === "function" ? children(visiting) : children;

  return visiting ? (
    <div className={clsx(className, "visiting")}>{label}</div>
  ) : (
    <Link href={href}>
      <a className={className}>{label}</a>
    </Link>
  );
};

const Logo = () => (
  <React.Fragment>
    crafting<span>way</span>
  </React.Fragment>
);

const Home = () => (
  <React.Fragment>
    ←<span className="spacer" />
    home
  </React.Fragment>
);
