import styles from "./SignUp.module.css"

const SignUp = () => {
  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupContent}>
        <h2 className={styles.title}>Sign Up</h2>
        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input type="email" id="email" className={styles.input} />
          </div>
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
            <button type="button" className={styles.loginButton}>
              Login
            </button>
            <button type="submit" className={styles.continueButton}>
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
