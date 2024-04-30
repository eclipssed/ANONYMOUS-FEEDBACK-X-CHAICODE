
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen justify-between items-center  ">
      
      <nav>navbar</nav>
      {children}
      <footer>Footer</footer>
    </div>
  );
}
