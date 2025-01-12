import { FC } from "react";
import Button from "./Button";
import useTheme, { ThemeMode } from "@/hooks/useTheme";
import { Icon } from "@radix-ui/react-select";
import { IoIosMoon, IoIosSunny } from "react-icons/io";
import { motion } from "framer-motion";

const SwitchTheme: FC = () => {
  const { toggleTheme, theme } = useTheme();

  return (
    <Button
      title="Switch Theme"
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Icon>{theme === ThemeMode.Dark ? <IoIosSunny /> : <IoIosMoon />}</Icon>
      </motion.div>
    </Button>
  );
};

export default SwitchTheme;
