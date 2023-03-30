import { observer } from "mobx-react-lite";

const Header = observer(function Header() {
  return (
    <header className="Header">
      <h1>
        crafting<span>way</span>
      </h1>
    </header>
  );
});

export default Header;
