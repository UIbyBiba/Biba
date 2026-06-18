const links = ["Home", "Gallery", "Contact"];

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M10 5H20" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 12H20" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 19H20" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Navigation({ isMobile }: { isMobile: boolean }) {
  if (isMobile) {
    return (
      <nav className="nav nav--mobile">
        <span className="nav__link nav__link--static">Home</span>
        <div className="nav__actions">
          <button className="btn btn--solid btn--icon" type="button" aria-label="Open menu">
            <MenuIcon />
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="nav">
      <ul className="nav__links">
        {links.map((label) => (
          <li key={label} className="nav__link">
            {label}
          </li>
        ))}
      </ul>
      <div className="nav__actions">
        <button className="btn btn--ghost" type="button">
          Login
        </button>
        <button className="btn btn--solid" type="button">
          Sign up
        </button>
      </div>
    </nav>
  );
}
