import { FC } from "react";
import { IoIosMoon, IoIosSunny } from "react-icons/io";
import useTheme, { ThemeMode } from "@/hooks/useTheme";

const SwitchTheme: FC = () => {
  const { toggleTheme, theme } = useTheme();

  return (
    <label className="inline-flex items-center relative">
      <input
        type="checkbox"
        className="peer hidden"
        onChange={toggleTheme}
        checked={theme === ThemeMode.Dark}
      />
      <div className="cursor-pointer relative w-20 h-[30px] bg-white peer-checked:bg-zinc-500 rounded-full after:absolute after:content-[''] after:size-6 after:bg-gradient-to-r from-orange-500 to-yellow-400 peer-checked:after:from-zinc-900 peer-checked:after:to-zinc-900 after:rounded-full after:top-[2.5px] after:left-1 active:after:w-7 peer-checked:after:left-[75px] peer-checked:after:translate-x-[-100%] shadow-sm duration-300 after:duration-300 after:shadow-md"></div>
      <IoIosSunny className="fill-white peer-checked:opacity-60 absolute size-5 left-1.5" />
      <IoIosMoon className="fill-black opacity-60 peer-checked:opacity-70 peer-checked:fill-white absolute size-5 right-2" />
    </label>
  );
};

export default SwitchTheme;
