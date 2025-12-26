import { useLocation } from "react-router-dom";
import Layout from "./layout/Layout";
import DashboardPage from "../pages/DashboardPage";
import InstallationsPage from "../pages/InstallationsPage";
import TrackingPage from "../pages/TrackingPage";
import ProfilePage from "../pages/ProfilePage";

export default function Dashboard() {
  const location = useLocation();

  const renderPage = () => {
    switch (location.pathname) {
      case "/installations":
        return <InstallationsPage />;
      case "/tracking":
        return <TrackingPage />;
      case "/profile":
        return <ProfilePage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <Layout>
      {renderPage()}
    </Layout>
  );
}

