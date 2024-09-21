"use client";

import { userState } from "@/store/atoms";
import { usePathname } from "next/navigation";
import { useRecoilValue } from "recoil";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { EllipsisVerticalIcon } from "lucide-react";

async function handleLogout() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    await axios.post(API_URL + "/auth/logout");
    localStorage?.removeItem("isLoggedIn");
    window.location.href = "/";
  } catch {}
}

export default function LoggedinUser() {
  const pathname = usePathname();
  const user = useRecoilValue(userState);
  if (!pathname.startsWith("/app")) return null;
  return (
    <div className="w-full h-16 border rounded-xl border-foreground flex justify-between items-center gap-4 sm:gap-8 p-2 px-4">
      <Avatar>
        <AvatarImage src={user?.avatarUrl} alt={user?.name} />
        <AvatarFallback>{user?.name[0]}</AvatarFallback>
      </Avatar>
      <p>{user?.name}</p>
      <Popover>
        <PopoverTrigger>
          <EllipsisVerticalIcon size={18} />
        </PopoverTrigger>
        <PopoverContent className="w-fit">
          <Badge
            variant={"secondary"}
            className="cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </Badge>
        </PopoverContent>
      </Popover>
    </div>
  );
}
