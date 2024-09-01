import React, {useState}  from 'react'

const inputTrack = () => {
    const [password , setPassword] = useState(""); // tracking password value 
    const [confirmPassword , setConfirmPassword] = useState(""); // tracking confirm password value
    const [passwordMatch, setPasswordMatch] = useState(false); // boolean if passwords match or not 
    const [inCorrectPassword, setInCorrectPassword] = useState("hidden"); // boolean if passwords match or not 

    const usrPassword = (value: string) => {
        setPassword(value);
        return password;
    }

    const usrConfirmPassword = (value: string) => {
        setConfirmPassword(value);
        return confirmPassword;
    }

    


  return (
    <div>
      
    </div>
  )
}

export default inputTrack;
