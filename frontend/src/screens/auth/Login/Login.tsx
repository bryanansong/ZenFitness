import styles from "./Login.module.css";

const Login = () => {
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginContent}>
        <h2 className={styles.title}>Login</h2>
        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <input type="text" id="username" className={styles.input} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input type="password" id="password" className={styles.input} />
          </div>
          <div className={styles.buttonGroup}>
            <button type="button" className={styles.signUpButton}>
              Sign Up
            </button>
            <button type="submit" className={styles.continueButton}>
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
