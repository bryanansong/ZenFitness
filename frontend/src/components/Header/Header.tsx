import styles from "./Header.module.css";

const Header = () => {
  return (
    <div className={styles.container}>
      <input className={styles.searchBar} type="text" name="" id="" placeholder="Search for an exercise..."/>
    </div>
  )
}

export default Header
