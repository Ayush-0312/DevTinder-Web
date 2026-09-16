import { LOGO } from "../utils/constants";

const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <img
        src={LOGO}
        alt=""
        width="48"
        height="48"
        className="opacity-80 animate-[pulse_1.2s_ease-in-out_infinite]"
      />
    </div>
  );
};

export default Loader;
