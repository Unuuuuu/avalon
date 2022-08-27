import React from "react";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = (props) => {
  const { children } = props;

  return (
    <div className="w-full h-full max-w-xl px-4 mx-auto flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default Layout;
