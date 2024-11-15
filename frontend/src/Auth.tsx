import { Outlet , Navigate } from "react-router-dom";


export default function Auth(){
    const userId=localStorage.getItem("userId");
    return userId? <Outlet/> : <Navigate to="/"/>; 
}