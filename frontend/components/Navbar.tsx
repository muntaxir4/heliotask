import Sidebar from "./Sidebar";

export default function Navbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen grid grid-rows-[auto_1fr]">
      <nav className="text-center border-b text-lg">
        <div className="m-2 flex justify-between">
          <Sidebar />
          <p className="font-semibold tracking-wide">HelioTask</p>
          <div></div>
        </div>
      </nav>
      <div className="grid">{children}</div>
    </div>
  );
}
