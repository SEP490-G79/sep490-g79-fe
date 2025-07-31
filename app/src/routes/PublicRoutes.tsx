import { Navigate, Outlet } from "react-router-dom";


function PublicRoutes() {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    return <Navigate to="/home" replace={true} />;
  }
  return <Outlet />;
}

export default PublicRoutes;
