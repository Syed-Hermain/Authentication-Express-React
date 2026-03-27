import useAuth from "../context/useAuth";
import {Navigate, Outlet} from "react-router"; 

function CheckAuth() {
    const {user} = useAuth();


    if(!user.isAuth){
        return <Navigate to="/login"/>
    }
    return (
        <Outlet/>
    )
}

export default CheckAuth;