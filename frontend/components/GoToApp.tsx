"use client";
import GoogleSignin from "@/components/GoogleSignin";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
export default function GoToApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  if (!isLoggedIn) return <GoogleSignin />;
  return (
    <Link href={"/app"} className="text-center">
      <Button className="rounded-full">Go to App</Button>
    </Link>
  );
}
