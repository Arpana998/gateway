import {useNavigate} from 'react-router-dom';
import classes from './ProfileForm.module.css';
import { useRef , useContext} from 'react';
import AuthContext from '../store/auth-context';


const ProfileForm = () => {
  
const inputResetPasswordRef = useRef();

const authCtx = useContext(AuthContext);
console.log(authCtx);

const navigate = useNavigate();

const submitHandler = (event) => {
  event.preventDefault();
  const newPassword = inputResetPasswordRef.current.value;
  
  console.log(newPassword)
  fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAXCM3xY6u-GLkChF0h2jde_weYSm09WiQ',
  {method: 'POST',
   body: JSON.stringify({
    idToken: authCtx.token,
    password: newPassword,
    returnSecureToken: false
  }),
   headers: {
    'Content-Type': 'application/json'
   }
  }).then((res) => {
     navigate('/');
  })
}


  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minLength="7" ref={inputResetPasswordRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
