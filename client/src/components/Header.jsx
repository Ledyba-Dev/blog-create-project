import { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import { UserContext } from "../UserContext";

export default function Header() {
    const { setUserInfo, userInfo } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:4000/profile", {
            credentials: "include",
        })
            .then((response) => {
                response.json().then((userInfo) => {
                    setUserInfo(userInfo);
                    setIsLoading(false);
                });
            })
            .catch(() => {
                setIsLoading(false);
            });
    }, []);

    function logout() {
        fetch("http://localhost:4000/logout", {
            credentials: "include",
            method: "POST",
        });
        setUserInfo(null);
    }

    const userName = userInfo?.username;

    if (isLoading) {
        return (
            <header>
                <Link to="/" className="logo">
                    MyBlog
                </Link>
                <nav>Loading...</nav> {/* O un spinner o algo de carga */}
            </header>
        );
    }

    return (
        <header>
            <Link to="/" className="logo">
                MyBlog
            </Link>
            <nav>
                {userName && (
                    <>
                        <Link to="/create">Create new Post</Link>
                        <a onClick={logout}>Logout</a>
                    </>
                )}
                {!userName && (
                    <>
                        <NavLink
                            to="/login"
                            className={({ isActive }) =>
                                isActive ? "active" : ""
                            }
                        >
                            Login
                        </NavLink>
                        <NavLink
                            to="/register"
                            className={({ isActive }) =>
                                isActive ? "active" : ""
                            }
                        >
                            Register
                        </NavLink>
                    </>
                )}
            </nav>
        </header>
    );
}
