import {useCallback, useEffect, useState} from "react"

type UseThemeReturnType = {
  toggleTheme: () => void
  isDarkMode: boolean
}

export const THEME_KEY = "theme_mode"

const DARK_MODE = "dark"
const LIGHT_MODE = "light"

const useTheme = (): UseThemeReturnType => {

  const savedTheme = localStorage.getItem(THEME_KEY)
  const isDarkMode = savedTheme ? JSON.parse(savedTheme) : false

  const [isDarkTheme, setIsDarkTheme] = useState(isDarkMode)

  useEffect(() => {
    const html = document.documentElement

    if (isDarkTheme) {
      html.className = DARK_MODE
    } else {
      html.className = LIGHT_MODE
    }

    localStorage.setItem(THEME_KEY, JSON.stringify(isDarkTheme))
  }, [isDarkTheme])

  const toggleTheme = useCallback(() => {
    setIsDarkTheme(!isDarkTheme)
  }, [isDarkTheme])

  return {toggleTheme, isDarkMode}
}

export default useTheme
