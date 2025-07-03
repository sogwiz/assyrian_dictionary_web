import React, { createRef } from 'react'; // Import createRef
import Parse from 'parse'; // Assuming you have Parse SDK installed and @types/parse for typings

// --- 1. Define Interfaces for Props and State ---

/**
 * Defines the shape of the props for the Login component.
 * We're assuming 'history' comes from a routing library like react-router-dom,
 * which provides a 'replace' method.
 */
interface LoginProps {
  history: {
    replace: (path: string) => void;
    // Add other methods/properties if they are used, e.g., push, location, etc.
  };
}

/**
 * Defines the shape of the state for the Login component.
 * In this specific component, no explicit state (this.state) is being managed,
 * so we use an empty interface.
 */
interface LoginState {}

class Login extends React.Component<LoginProps, LoginState> {

  // --- 3. Create Refs using React.createRef() ---
  // These refs will be attached to the input elements to access their DOM nodes.
  private emailInputRef = createRef<HTMLInputElement>();
  private passwordInputRef = createRef<HTMLInputElement>();

  // --- 4. Class Methods as Arrow Functions (for auto-binding 'this') ---
  // Using arrow functions for class methods automatically binds 'this' to the component instance.
  // This means you no longer need .bind(this) in your JSX.

  onLogin = (): void => {
    // Access the input values safely using optional chaining (.current?.value)
    // and provide a default empty string if .current is null or value is undefined.
    const email = this.emailInputRef.current?.value || '';
    const password = this.passwordInputRef.current?.value || '';

    // Handle empty inputs before sending to Parse
    if (!email || !password) {
        alert('Please enter both username and password.');
        return;
    }

    Parse.User.logIn(email, password)
      .then(() => {
        // Successfully logged in, navigate to admin page
        this.props.history.replace('/admin/');
      })
      .catch((error: Parse.Error) => {
        // Handle login errors from Parse (e.g., wrong credentials)
        console.error('Login Error:', error);
        alert(`Login failed: ${error.message}`); // Display error message to the user
      });
  };

  // Not used yet, but converted for consistency
  onSignup = (): void => {
    const email = this.emailInputRef.current?.value || '';
    const password = this.passwordInputRef.current?.value || '';

    if (!email || !password) {
        alert('Please enter both username and password for signup.');
        return;
    }

    Parse.User.signUp(email, password, email)
      .then(() => {
        // Successfully signed up
        this.props.history.replace('/'); // Redirect after signup
      })
      .catch((error: Parse.Error) => {
        // Handle signup errors from Parse
        console.error('Signup Error:', error);
        alert(`Signup failed: ${error.message}`);
      });
  };

  // --- 5. Render Method ---
  render(): React.ReactNode {
    return (
      <div id='login'>
        <div className='login-container'>
          {/* --- 6. Assign Refs to Input Elements --- */}
          {/* Use the ref objects created earlier */}
          <input type='text' ref={this.emailInputRef} placeholder='Username' />
          <input type='password' ref={this.passwordInputRef} placeholder='Password' />
          {/* --- 7. Call Class Methods Directly (no .bind(this)) --- */}
          <button className='submit login' onClick={this.onLogin}> Login </button>
          {/*<button className='submit signup' onClick={this.onSignup}> new user </button>*/}
          <p>Forgot Password? Reset Password</p>
        </div>
      </div>
    );
  }

  // render() {
  //   return (
  //     <div id='login'>
  //       <div className='login-container'>
  //       	<input type='text' ref='emailInput' placeholder='Username'/>
  //       	<input type='password' ref='passwordInput' placeholder='Password'/>
  //       	<button className='submit login' onClick={this.onLogin.bind(this)}> Login </button>
  //       	{/*<button className='submit signup' onClick={this.onSignup.bind(this)}> new user </button>*/}
  //         <p>Forgot Password? Reset Password</p>
  //     	</div>
  //     </div>
  //   )
  // }

  /*
  onLogin() {
    const email = this.refs.emailInput.value
    const password = this.refs.passwordInput.value
    Parse.User.logIn(email, password).then(() => {
      this.props.history.replace('/admin/')
    }, (error) => {
      console.log(error)
    })
  }

//not used yet
  onSignup() {
    const email = this.refs.emailInput.value
    const password = this.refs.passwordInput.value
    Parse.User.signUp(email, password).then(() => {
      this.props.history.replace('/')
    }, (error) => {
      console.log(error)
    })
  }
  */
}

export default Login
