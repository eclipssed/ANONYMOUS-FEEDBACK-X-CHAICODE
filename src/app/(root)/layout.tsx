import { Toaster } from "react-hot-toast";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen justify-between items-center  ">
      <Toaster/>
      <nav>navbar</nav>
      {children}
      <footer>Footer</footer>
    </div>
  );
}
