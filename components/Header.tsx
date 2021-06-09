import I from "../icons";
import styles from "../styles/Header.module.scss";

function Header() {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>DS & Algorithms</h1>

      <p className={styles.description}>
        visualising data structures and algorithms through animation
      </p>

      <div className={styles.search}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search ..."
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        <I name="Search" />
      </div>
    </div>
  );
}

export default Header;
