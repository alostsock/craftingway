import "./Header.scss";

import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { Link, useLocation } from "wouter";

const Header = observer(function Header() {
  const [location, _] = useLocation();

  return (
    <header className="Header">
      <nav className={clsx({ expanded: location === "/" })}>
        {location === "/" ? (
          <div className="logo">
            crafting<span>way</span>
          </div>
        ) : (
          <Link href="/" className="home">
            «<span />
            home
          </Link>
        )}

        <div className="links">
          <div className="internal">
            {location !== "/logbook" && <Link href="/logbook">logbook</Link>}
          </div>

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
