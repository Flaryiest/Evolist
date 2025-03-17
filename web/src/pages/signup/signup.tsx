import styles from "./signup.module.css"
import Navbar from "@/components/navbar/navbar";
import { useState } from "react";
import { Link } from "react-router-dom";
export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    try {
      const response = await fetch('/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        }),
      });

      if (response.ok) {
        window.location.href = '/dashboard'; // Redirect after successful signup
      } else {
        const errorText = await response.text();
        alert(`Signup failed: ${errorText}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during signup');
    }
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.signupPage}>
        <div className={styles.signup}>
          <div className={styles.signupLeft}>
            <h2 className={styles.signupLogo}>Evolist</h2>
            <h1 className={styles.signupHeader}>Create your account</h1>
            <p className={styles.signupText}>
              Join Evolist today and start tracking your personal growth journey.
            </p>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id={styles.firstName}
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id={styles.lastName}
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="password">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                type="submit"
                className={styles.submitButton}
              >
                Sign Up
              </button>
            </form>
            <p className={styles.loginLink}>
              Already have an account? <Link to="/login" className={styles.redirect}>Log in</Link>
            </p>
          </div>
          <div className={styles.signupRightImageContainer}>
            <img className={styles.signupRightImage} src ="/skill.webp" alt="building blocks for skills"></img>
          </div>
        </div>
      </div>
    </div>
  );
}
