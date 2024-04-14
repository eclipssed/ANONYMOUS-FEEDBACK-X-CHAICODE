"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const signupPage = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const onSignUp = async () => {
    try {
      setLoading(true)
      const response = await axios.post("/api/users/signup", user);
      console.log(response);
      if (response.status === 200) {
        toast.success("signup up successfully");
        router.push("/login");
      }
      setLoading(false)
    } catch (error: any) {
      console.log("signUp failed, please try again later.");
      toast.error("signUp failed, please try again later.");
    }
  };

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.username.length > 0
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
      <h1>{loading ? "Processing" : "sign Up"}</h1>
      <hr />
      <label htmlFor="username">Username</label>
      <input
        className="border border-gray-300 p-2 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        type="text"
        name="username"
        onChange={handleChange}
        placeholder="leo..."
        id="username"
        value={user.username}
      />
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
        onClick={onSignUp}
      >
        Sign up
      </button>
      <p>Already have an account. Visit <Link className="text-blue-500" href={'/login'}>login</Link> page.</p>

    </div>
  );
};

export default signupPage;
