import styles from './navbar.module.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setTimeout(() => {
      setMenuOpen(!menuOpen);
    }, 50);
  };

  const handleCloseMenu = () => {
    setTimeout(() => {
      setMenuOpen(false);
    }, 50);
  };

  return (
    <div className={`${styles.navbarContainer} ${menuOpen ? styles.open : ''}`}>
      <div className={`${styles.navbar} ${menuOpen ? styles.open : ''}`}>
        <div className={styles.navbarLogo}>
          <Link to="/" className={styles.navbarLogoText}>
            <img className={styles.logo} src="/evolition logo.webp" alt="Evolition" />
          </Link>
        </div>
        <div
          onClick={handleCloseMenu}
          className={`${styles.navbarLinks} ${menuOpen ? styles.open : ''}`}
        >
          <Link
            to="/info"
            className={`${styles.navbarBaseLink} ${menuOpen ? styles.open : ''}`}
          >
            Info
          </Link>
          <Link
            to="/demo"
            className={`${styles.navbarBaseLink} ${menuOpen ? styles.open : ''}`}
          >
            Demo
          </Link>
          {menuOpen && (
            <>
              <Link
                to="/login"
                className={`${styles.navbarBaseLink} ${menuOpen ? styles.open : ''}`}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className={`${styles.navbarBaseLink} ${menuOpen ? styles.open : ''}`}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
        <div className={styles.navbarOnboardLinks}>
          <Link to="/login" className={styles.navbarLoginLink}>
            Login
          </Link>
          <Link to="/signup" className={styles.navbarSignupLink}>
            Sign Up
          </Link>
        </div>
        <div className={styles.navbarMenuIcon} onClick={handleMenuToggle}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              d="M3 6h18M3 12h18M3 18h18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
