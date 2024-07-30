import { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
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

function App() {
  const [client, setClient] = useState(false);
  const navigate = useNavigate(); // hook for navigation
  const location = useLocation(); // hook for current location
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);

  // scroll up
  useEffect(() => {
    window.scroll(0, 0);

    setClient(true);
  }, []);

  useEffect(() => {
    // Redirect logic based on user state and current path
    const restrictedRoutes = ["/dashboard", "/new/campaign"];
    const authRoutes = ["/create/campaign", "/login"];

    if (!user && restrictedRoutes.includes(location.pathname)) {
      // Redirect to home if trying to access restricted routes without being logged in
      navigate("/");
    } else if (user && authRoutes.includes(location.pathname)) {
      // Redirect to dashboard if logged in and trying to access authentication routes
      navigate("/dashboard");
    }
  }, [user, location, navigate]);

  // // check if css is already loaded
  // useEffect(() => {
  //   const cssLink = document.querySelector('link[rel="stylesheet"]');

  //   const handleCssLoad = () => {
  //     setIsLoading(false);
  //   };

  //   // Check if CSS is loaded
  //   if (cssLink) {
  //     cssLink.addEventListener("load", handleCssLoad);

  //     // Clean up the event listener on component unmount
  //     return () => {
  //       cssLink.removeEventListener("load", handleCssLoad);
  //     };
  //   } else {
  //     // If CSS link is not found, stop loading
  //     setIsLoading(false);
  //   }
  // }, []);

  // if (isLoading) {
  //   return <div style={{ textAlign: "center" }}>Checking User...</div>;
  // }

  return (
    <div className="App">
      <div className="app-div">
        <Nav />

        {/* routing */}
        <Routes>
          {/* home */}
          <Route path="/" exact element={<Home />} />

          {/* authentication */}
          <Route path="/create/campaign" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* account */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new/campaign" element={<CreateCampaign />} />

          {/* campaigns */}
          <Route path="/campaign/:campaignId" element={<ViewCampaign />} />

          {/* FAQ */}
          <Route
            path="/frequently-asked-questions"
            element={<FAQComponent />}
          />
        </Routes>
      </div>

      {/* footer */}
      <Footer />

      {/* custom components */}
      {client && <Toaster />}
    </div>
  );
}

export default App;
