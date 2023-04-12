import { useState, useRef, useContext } from 'react';
import {useNavigate} from 'react-router-dom';
import classes from './AuthForm.module.css';
import AuthContext from '../store/auth-context';


const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const authCtx = useContext(AuthContext)

  const emailRef = useRef();
  const passwordRef = useRef();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailRef.current.value;
    const enteredPassword = passwordRef.current.value;
    
    setIsLoading(true);
    let Url ;
    if(isLogin){
     Url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAXCM3xY6u-GLkChF0h2jde_weYSm09WiQ'
    }else{
     Url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAXCM3xY6u-GLkChF0h2jde_weYSm09WiQ'
    }
    fetch(Url,
      {
        method: 'POST',
        body: JSON.stringify({
          email: enteredEmail, 
          password:enteredPassword,
          returnSecureToken: true,
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        setIsLoading(false);
        if(res.ok){
          return res.json();
        }else{
          return res.json().then(data => {
             let errorMessage = 'Authentication Failed';
             throw new Error(errorMessage);
          })
        }
      }).then((data) => {
        console.log(data)
        let expirationTime = new Date(new Date().getTime() + (+data.expiresIn * 1000))
        authCtx.login(data.idToken, expirationTime.toISOString());
        navigate('/');
        
      })
      .catch((err) => {
        alert(err.message)
      })
   
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' ref={emailRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' ref={passwordRef} required />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>Sending Request...</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
