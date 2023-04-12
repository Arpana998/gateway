import React, { useEffect, useState, useCallback } from "react"

let logoutTimer;

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: 'false',
    login: (token) => {},
    logout: () => {}
})

const calculateRemainigTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();//expirationTime is converted into string while passing hence converted back to data

  const remainingDurationTime = adjExpirationTime - currentTime;
  return remainingDurationTime;

}

const retrivedStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  const storedExpiredDate = localStorage.getItem('expirationTime');

  const remainingTime = calculateRemainigTime(storedExpiredDate);
  if(remainingTime <= 3600){
    localStorage.removeItem('token')
    localStorage.removeItem('expirationTime')
    return null;
  }
  return {
    token: storedToken,
    duration: remainingTime
  }
    
}

export const AuthContextProvider = (props) => {
  const tokenData = retrivedStoredToken();

  let initialToken;
  if(tokenData){
    initialToken = tokenData.token;
  }
  
  const [token, setToken] = useState(initialToken)

  const userIsLoggedIn = !!token;


  const logOutHandler = useCallback(() => {
    setToken(null)
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    if(logoutTimer){
      clearTimeout(logoutTimer)
    }
    
  }, []);

  const loginHandler = (token, expirationTime) =>{
    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('expirationTime', expirationTime);

    const remainingTime = calculateRemainigTime(expirationTime);

    logoutTimer = setTimeout(logOutHandler, remainingTime);
  }

  useEffect(() => {
    if(tokenData) {
      console.log(tokenData.duration);
      logoutTimer = setTimeout(logOutHandler, tokenData.duration);
    }
  }, [tokenData, logOutHandler])

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logOutHandler
  }

    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
}

export default AuthContext;