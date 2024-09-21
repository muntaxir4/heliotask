import Image from "next/image";
import GoToApp from "./GoToApp";
import Image1 from "@/public/image1.png";
import Image2 from "@/public/image2.png";

export default function Home() {
  return (
    <div className="m-2 grid gap-4 content-start overflow-auto">
      <div className="mt-6 ">
        <h1 className="text-4xl font-semibold text-center">
          Welcome to <span className="underline italic">HelioTask</span>
        </h1>
        <p className="text-center mt-2 tracking-wide">
          This allows you to create tasks and view them interactively.
        </p>
      </div>
      <GoToApp />
      <div className="grid sm:grid-cols-2 p-2 gap-2">
        <div className="grid gap-2">
          <Image src={Image1} alt="Image1" className="border p-2" />
          <p className="text-center text-sm">Kanban</p>
        </div>
        <div className="grid gap-2">
          <Image src={Image2} alt="Image2" className="border p-2" />
          <p className="text-center text-sm">All Tasks</p>
        </div>
      </div>
    </div>
  );
}
