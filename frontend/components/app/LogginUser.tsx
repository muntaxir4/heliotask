"use client";

import { userState } from "@/store/atoms";
import { usePathname } from "next/navigation";
import { useRecoilValue } from "recoil";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function LogginUser() {
  const pathname = usePathname();
  const user = useRecoilValue(userState);
  if (!pathname.startsWith("/app")) return null;
  return (
    <div className="w-full h-16 border rounded-xl border-black flex items-center gap-4 sm:gap-8 p-2">
      <Avatar>
        <AvatarImage src={user?.avatarUrl} alt={user?.name} />
        <AvatarFallback>{user?.name[0]}</AvatarFallback>
      </Avatar>
      <p>{user?.name}</p>
    </div>
  );
}
