"use client";
import {
  GoogleOAuthProvider,
  useGoogleLogin,
  googleLogout,
} from "@react-oauth/google";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

function GoogleSigninHandler() {
  const { toast } = useToast();
  const router = useRouter();
  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSignin,
    onError: (error) => {
      console.error(error);
    },
    flow: "auth-code",
  });
  async function handleGoogleSignin({ code }: { code: string }) {
    console.log(code, toast);
    toast({
      title: "Logging in",
      duration: 15000,
    });
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
      await axios.post(
        API_URL + "/auth/google",
        {
          code,
        },
        {
          withCredentials: true,
        }
      );
      googleLogout();
      toast({
        title: "Logged in",
        duration: 2000,
      });
      router.push("/app");
    } catch (error) {
      toast({
        title: "Error",
        description: "Signin with Google failed",
        variant: "destructive",
        duration: 3000,
      });
    }
  }
  return (
    <div onClick={() => googleLogin()}>
      <Button className="rounded-full">Continue with Google</Button>
    </div>
  );
}

export default function GoogleSignin() {
  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <GoogleSigninHandler />
    </GoogleOAuthProvider>
  );
}
