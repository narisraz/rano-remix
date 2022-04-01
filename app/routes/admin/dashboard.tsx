import { LoaderFunction, MetaFunction } from "remix"

export const loader: LoaderFunction = () => {
  return {}
}

export const meta: MetaFunction = () => {
  return {
    title: "Tableau de bord",
  };
};

export default function Dashboard() {
  return (
    <>
      Dashboard
    </>
  )
}