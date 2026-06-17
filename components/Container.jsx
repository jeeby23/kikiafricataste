"use client";

const Container = ({ children, className = "" }) => {
  return (
    <div
      className={`
        w-full
        mx-auto
        px-4 sm:px-6 md:px-8 lg:px-12
        max-w-[1440px]
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Container;