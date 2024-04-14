"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const profilePage = () => {
  const router = useRouter();
  const [data, setData] = useState("nothing");

  const getUserDetails = async () => {
    try {
      const res = await axios.post("/api/users/me");
      console.log(res)
      if (res.data.status === 200) {
        toast.success("successfully fetched user details");
        setData(res.data.data.username);
      } else {
        toast.error(res.data.error);
      }
    } catch (error: any) {
      console.log("error while fetching user details");
      toast.error("failed to fetch user details");
    }
  };
  const logout = async () => {
    try {
      const res = await axios.get("/api/users/logout");
      if (res.data.status === 200) {
        toast.success("Daddy chill. Successfully logged out the user.");
        router.push("/login");
      }
    } catch (error) {
      console.log("couldn't log out the user");
      toast.error("failed to logout the user");
    }
  };
  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-2 gap-2">
      <h1>Profile Page</h1>
      <h2>{data === "nothing" ? "Nothing" : data}</h2>
      <button className="bg-red-500 p-2 rounded-lg" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default profilePage;
