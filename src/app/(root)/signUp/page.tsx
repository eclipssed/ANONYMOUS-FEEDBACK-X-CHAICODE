import React, { useState } from "react";

const signUpPage = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    passowrd: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSignUp = async()=> {
    
  }
  return (
    <div>
      signUpPag <div>beauty</div>
    </div>
  );
};

export default signUpPage;
