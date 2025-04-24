import React from "react";

const Best = () => {
  return (
    <section
      className="relative h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/detc4yjdi/image/upload/v1745498730/Desktop_-_4_p2cjn5.png')",
      }}
    >
      <div className="text-right px-4 sm:px-10 text-white max-w-2xl font-krona">
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
          Best features <br />
          provided <br />
          by <span className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
            Raise3
          </span>
        </h1>
      </div>
    </section>
  );
};

export default Best;
