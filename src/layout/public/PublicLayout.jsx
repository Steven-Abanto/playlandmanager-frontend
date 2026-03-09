import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";

function PublicLayout() {
  return (
    <div className="min-h-screen bg-white text-black">
      <PublicNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default PublicLayout;