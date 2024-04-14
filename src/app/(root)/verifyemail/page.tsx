"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const verifyEmailPage = () => {
  // const router = useRouter();
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);


  const verifyUserEmail = async () => {
    try {
      const resposne : any = await axios.post("/api/users/verifyemail", { token });
      console.log(resposne)
      if (resposne.data.status === 200) {
        toast.success("successfully verified the email");
        setVerified(true);
      }
      else{
        toast.error(resposne.data.error);

      }
    } catch (error: any) {
      console.log("error occured while verifying user email");
      toast.error("Couldn't verify the email. Please try again later.");
    }
  };
  useEffect(() => {
    // const { query } = router;

    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <h2>{token ? token : "No Token "}</h2>
      <button onClick={verifyUserEmail} className="p-2 bg-green-500 rounded-lg">
        Click to verify the Email
      </button>
      <p>
        {verified && (
          <>
            <p className="text-green-500">Email is verified</p>
            <Link className="text-blue-500" href={"/login"}>Visit login</Link>
          </>
        )}
      </p>
    </div>
  );
};

export default verifyEmailPage;
