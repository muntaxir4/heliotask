import Link from "next/link";
import Sidebar from "./Sidebar";
import ThemeChanger from "./ThemeChanger";

export default function Navbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen grid grid-rows-[auto_1fr] overflow-hidden">
      <nav className="text-center border-b text-lg">
        <div className="m-2 flex justify-between items-center">
          <Sidebar />
          <Link href={"/"} className="font-semibold tracking-wide">
            HelioTask
          </Link>
          <ThemeChanger />
        </div>
      </nav>
      <div className="grid overflow-hidden">{children}</div>
    </div>
  );
}
