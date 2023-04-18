import "./Header.scss";

import { observer } from "mobx-react-lite";

const Header = observer(function Header() {
  return (
    <header className="Header">
      <h1>
        crafting<span>way</span>
      </h1>
      <div className="links">
        <a
          className="github"
          title="Github"
          href="https://github.com/alostsock/craftingway"
          target="_blank" rel="noreferrer"
        >
          <img src="/github.svg" alt="Github repository" />
        </a>

        <a className="discord" title="Discord" href="https://discord.gg/sKC4VxeMjY" target="_blank" rel="noreferrer">
          <img src="/discord.svg" alt="Join the Discord server" />
        </a>

        <a className="ko-fi" title="Ko-fi" href="https://ko-fi.com/alostsock" target="_blank" rel="noreferrer">
          <img src="/ko-fi.webp" alt="Buy Me a Coffee at ko-fi.com" />
        </a>
      </div>
    </header>
  );
});

export default Header;
