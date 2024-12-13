"use client";

import { FC } from "react";
import Button from "./Button";
import useTheme from "@/hooks/useTheme";
import { Icon } from "@radix-ui/react-select";
import { IoIosMoon, IoIosSunny } from "react-icons/io";

const ButtonSwitchTheme: FC = () =>{
    const {toggleTheme, theme} = useTheme()
    return (
        <Button onClick={toggleTheme} className="size-8">
          <Icon>{theme === "dark" ? (<IoIosSunny/>) : (<IoIosMoon/>)}</Icon>
        </Button>
    )
}

export default ButtonSwitchTheme