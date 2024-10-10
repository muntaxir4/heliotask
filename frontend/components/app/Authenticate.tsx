"use client";

import { userState } from "@/store/atoms";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import Loading from "../Loading";

async function getUser() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const response = await axios.get(API_URL + "/user", {
    withCredentials: true,
  });
  return response.data;
}

export default function Authenticate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });
  const setUser = useSetRecoilState(userState);
  if (isLoading) return <Loading />;
  else if (isError) {
    localStorage?.removeItem("isLoggedIn");
    window.location.href = "/";
    return <div>Error...</div>;
  } else if (data) {
    const user = data.user;
    setUser(user);
    return <>{children}</>;
  }
}
