import logo from "/logo.png";

const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-[60vh] text-lg">
      <img
        src={logo}
        alt="Loading..."
        loading="eager"
        className="w-12 h-12 opacity-80 animate-[pulse_1.2s_ease-in-out_infinite]"
      />
    </div>
  );
};

export default Loader;
