import styles from './signup.module.css';
import Navbar from '@/components/navbar/navbar';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/authContext';

export default function Signup() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);

    if (formData.password !== formData.confirmPassword) {
      setSignupError("Passwords don't match");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await fetch('http://localhost:8080/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        })
      });

      if (response.ok) {
        console.log('Account created successfully');
        
        const loginSuccess = await auth.login(formData.email, formData.password);
        
        if (loginSuccess) {
          console.log('Auto-login successful after signup');
          await auth.refreshAuth();
          navigate('/dashboard');
        } else {
          navigate('/login')
          setSignupError('Account created but login failed. Please try logging in manually.');
        }
      } else {
        const errorText = await response.text();
        setSignupError(`Signup failed: ${errorText}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setSignupError('An error occurred during signup');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.signupPage}>
        <div className={styles.signup}>
          <div className={styles.signupLeft}>
            <h2 className={styles.signupLogo}>Evolition</h2>
            <h1 className={styles.signupHeader}>Create your account</h1>
            <p className={styles.signupText}>
              Join Evolition today and start tracking your personal growth
              journey.
            </p>
            
            {signupError && (
              <div className={styles.errorMessage}>
                {signupError}
              </div>
            )}
            
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>
            <p className={styles.loginLink}>
              Already have an account?{' '}
              <Link to="/login" className={styles.redirect}>
                Log in
              </Link>
            </p>
          </div>
          <div className={styles.signupRightImageContainer}>
            <img
              className={styles.signupRightImage}
              src="/skill.webp"
              alt="building blocks for skills"
            ></img>
          </div>
        </div>
      </div>
    </div>
  );
}
