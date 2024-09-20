import Authenticate from "@/components/app/Authenticate";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <Authenticate>{children}</Authenticate>;
}
