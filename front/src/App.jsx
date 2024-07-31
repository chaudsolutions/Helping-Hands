import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./Components/Context/AuthContext";

// components
import Home from "./Components/App/Home/Home";
import Nav from "./Components/Custom/Nav/Nav";
import Footer from "./Components/Custom/Footer/Footer";
import Register from "./Components/Auth/Register";
import Login from "./Components/Auth/Login";
import Dashboard from "./Components/App/Dashboard/Dashboard";
import CreateCampaign from "./Components/App/Dashboard/CreateCampaign";
import ViewCampaign from "./Components/App/Campaigns/ViewCampaign";
import FAQComponent from "./Components/App/FAQ/FAQComponent";
import Campaigns from "./Components/App/Campaigns/Campaigns";
import NotFound from "./Components/App/404/NotFound";

function App() {
  const { user } = useAuthContext();

  // scroll up
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <div className="App">
      <div className="app-div">
        <Nav />

        {/* routing */}
        <Routes>
          {/* home */}
          <Route path="/" exact element={<Home />} />

          {/* authentication */}
          <Route
            path="/create/campaign"
            element={!user ? <Register /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/dashboard" />}
          />

          {/* account */}
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/" />}
          />
          <Route
            path="/new/campaign"
            element={user ? <CreateCampaign /> : <Navigate to="/" />}
          />

          {/* campaigns */}
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaign/:campaignId" element={<ViewCampaign />} />

          {/* FAQ */}
          <Route
            path="/frequently-asked-questions"
            element={<FAQComponent />}
          />

          {/* Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {/* footer */}
      <Footer />

      {/* custom components */}
      <Toaster />
    </div>
  );
}

export default App;
