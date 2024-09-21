"use client";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";

export default function ThemeChanger() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      {theme === "dark" ? (
        <Button onClick={() => setTheme("light")}>
          <SunIcon />
        </Button>
      ) : (
        <Button onClick={() => setTheme("dark")}>
          <MoonIcon />
        </Button>
      )}
    </div>
  );
}
