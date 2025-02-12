import { Outlet } from "react-router";
import Header from "../components/Header";

export default function Layout () {
    return (
        <main>
            <Header></Header>
            <Outlet></Outlet>
        </main>
    )
}