import styles from './header.module.css';
import searchIcon from './assets/search.svg';
import { useState } from 'react';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className={styles.header}>
      <div className={styles.searchContainer}>
        <form onSubmit={handleSubmit} className={styles.searchForm}>
          <img src={searchIcon} alt="Search" className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className={styles.searchInput}
          />
        </form>
      </div>
      <div className={styles.headerRight}>
        <span className={styles.welcomeText}>Welcome back, User!</span>
        <div className={styles.userAvatar}>
          <span>U</span>
        </div>
      </div>
    </header>
  );
}
