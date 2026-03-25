"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react")); // Import createRef
const parse_1 = __importDefault(require("parse")); // Assuming you have Parse SDK installed and @types/parse for typings
class Login extends react_1.default.Component {
    constructor() {
        super(...arguments);
        // --- 3. Create Refs using React.createRef() ---
        // These refs will be attached to the input elements to access their DOM nodes.
        this.emailInputRef = (0, react_1.createRef)();
        this.passwordInputRef = (0, react_1.createRef)();
        // --- 4. Class Methods as Arrow Functions (for auto-binding 'this') ---
        // Using arrow functions for class methods automatically binds 'this' to the component instance.
        // This means you no longer need .bind(this) in your JSX.
        this.onLogin = () => {
            var _a, _b;
            // Access the input values safely using optional chaining (.current?.value)
            // and provide a default empty string if .current is null or value is undefined.
            const email = ((_a = this.emailInputRef.current) === null || _a === void 0 ? void 0 : _a.value) || '';
            const password = ((_b = this.passwordInputRef.current) === null || _b === void 0 ? void 0 : _b.value) || '';
            // Handle empty inputs before sending to Parse
            if (!email || !password) {
                alert('Please enter both username and password.');
                return;
            }
            parse_1.default.User.logIn(email, password)
                .then(() => {
                // Successfully logged in, navigate to admin page
                this.props.history.replace('/admin/');
            })
                .catch((error) => {
                // Handle login errors from Parse (e.g., wrong credentials)
                console.error('Login Error:', error);
                alert(`Login failed: ${error.message}`); // Display error message to the user
            });
        };
        // Not used yet, but converted for consistency
        this.onSignup = () => {
            var _a, _b;
            const email = ((_a = this.emailInputRef.current) === null || _a === void 0 ? void 0 : _a.value) || '';
            const password = ((_b = this.passwordInputRef.current) === null || _b === void 0 ? void 0 : _b.value) || '';
            if (!email || !password) {
                alert('Please enter both username and password for signup.');
                return;
            }
            parse_1.default.User.signUp(email, password, email)
                .then(() => {
                // Successfully signed up
                this.props.history.replace('/'); // Redirect after signup
            })
                .catch((error) => {
                // Handle signup errors from Parse
                console.error('Signup Error:', error);
                alert(`Signup failed: ${error.message}`);
            });
        };
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
    // --- 5. Render Method ---
    render() {
        return (react_1.default.createElement("div", { id: 'login' },
            react_1.default.createElement("div", { className: 'login-container' },
                react_1.default.createElement("input", { type: 'text', ref: this.emailInputRef, placeholder: 'Username' }),
                react_1.default.createElement("input", { type: 'password', ref: this.passwordInputRef, placeholder: 'Password' }),
                react_1.default.createElement("button", { className: 'submit login', onClick: this.onLogin }, " Login "),
                react_1.default.createElement("p", null, "Forgot Password? Reset Password"))));
    }
}
exports.default = Login;
