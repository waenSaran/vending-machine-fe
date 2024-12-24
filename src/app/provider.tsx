"use client"

import { CssVarsProvider } from "@mui/joy";

export default function Providers(props: { children: React.ReactNode }) {
  return (
    <CssVarsProvider>
      {props.children}
    </CssVarsProvider>
  )
}