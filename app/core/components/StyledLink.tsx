import { Link, LinkProps } from "@mui/material"

interface StyledLinkProps extends LinkProps {
  to: string
  children: React.ReactNode
}

export const StyledLink = ({ children, to }: StyledLinkProps) => {
  return (
    <Link href={to} underline={"none"}>
      {children}
    </Link>
  )
}