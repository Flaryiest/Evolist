import styles from './header.module.css';
import searchIcon from './assets/search.svg';
import { useState } from 'react';
import { useAuth } from '@/hooks/authContext';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const userInfo = useAuth();

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
        <span className={styles.welcomeText}>
          Hello, {userInfo?.user?.firstName || 'User'}{' '}
          {userInfo?.user?.lastName || ''}
        </span>
        <div className={styles.userAvatar}>
          <span>{userInfo?.user?.firstName?.[0] || 'U'}</span>
        </div>
      </div>
    </header>
  );
}
