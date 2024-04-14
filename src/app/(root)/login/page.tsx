"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";


const loginPage = () => {
  const router = useRouter();
  const [user, setUser] = useState({
  
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    try {
      setLoading(true)

      const response = await axios.post("/api/users/signup", user);
      console.log(response);
      if (response.status === 200) {
        toast.success("logged in successfully");
        router.push("/profile");
      }
      setLoading(false);

    } catch (error: any) {
      console.log("signUp failed, please try again later.");
      toast.error("signUp failed, please try again later.");
    }
  };

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0
   
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);
  const handleChange = (e: any) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <h1>{loading ? "Processing" : "Login"}</h1>
      <hr />
     
      <label htmlFor="username">Email</label>
      <input
        className="border border-gray-300 p-2 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        type="text"
        name="email"
        onChange={handleChange}
        placeholder="leo@gmial.com"
        id="email"
        value={user.email}
      />
      <label htmlFor="username">Password</label>
      <input
        className="border border-gray-300 p-2 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        type="password"
        name="password"
        onChange={handleChange}
        placeholder="123..."
        id="password"
        value={user.password}
      />
      <button
        disabled={buttonDisabled}
        className={` p-2 rounded-lg hover:cursor-pointer ${buttonDisabled ? "bg-red-500 " : "bg-green-500"}`}
        onClick={onLogin}
      >
        Login
      </button>
      <p>Don't have an account. Visit <Link className="text-blue-500" href={'/signup'}>signup</Link> page.</p>

    </div>
  );
};


export default loginPage;
