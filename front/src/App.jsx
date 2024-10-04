import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./Components/Context/AuthContext";
import ScrollToTop from "react-scroll-to-top";
import { useUserData } from "./Components/Hooks/useQueryFetch/useQueryData";

// components
import Home from "./Components/App/Home/Home";
import Nav from "./Components/Custom/Nav/Nav";
import Footer from "./Components/Custom/Footer/Footer";
import Register from "./Components/Auth/Register";
import Login from "./Components/Auth/Login";
import Dashboard from "./Components/App/Dashboard/Dashboard";
import CreateCampaign from "./Components/App/Dashboard/CreateCampaign";
import ViewCampaign from "./Components/App/Campaigns/ViewCampaign";
import Campaigns from "./Components/App/Campaigns/Campaigns";
import NotFound from "./Components/App/404/NotFound";
import FAQComponent from "./Components/App/Others/FAQ/FAQComponent";
import About from "./Components/App/Others/About/About";
import Contact from "./Components/App/Others/Contact/Contact";
import HelpCenter from "./Components/App/Others/HelpCenter/HelpCenter";
import Privacy from "./Components/App/Others/Privacy/Privacy";
import Profile from "./Components/App/Profile/Profile";
import FundsRequestPayment from "./Components/App/Funds/FundsRequestPayment";
import Admin from "./Components/App/Admin/Admin";
import PasswordReset from "./Components/Auth/PasswordReset";
import { Failed, Success } from "./Components/App/Payment/Payment";
import ErrorBoundary from "./Components/Error/ErrorBoundary";

function App() {
  const { user } = useAuthContext();

  const navigate = useNavigate();

  // fetch user data and campaign data
  const { userData, isUserDataLoading, isUserDataError } = useUserData();

  // extract data
  const { role } = userData || {};

  // scroll up
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  useEffect(() => {
    if (isUserDataError) return navigate("/dashboard");
  }, [isUserDataError, navigate]);

  const adminRole = role === "admin";

  return (
    <ErrorBoundary>
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
            <Route
              path="/reset-password/:resetToken"
              element={!user ? <PasswordReset /> : <Navigate to="/dashboard" />}
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
            <Route
              path="/profile"
              element={user ? <Profile /> : <Navigate to="/" />}
            />

            {/* campaigns */}
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/campaign/:campaignId" element={<ViewCampaign />} />

            {/* funds */}
            <Route
              path="/request-funds/:requestUserId/:requestFundsId"
              element={<FundsRequestPayment />}
            />

            {/* payment status page */}
            <Route path="/success/:paymentType" element={<Success />} />
            <Route path="/failed" element={<Failed />} />

            {/* ADMIN */}
            <Route
              path="/admin"
              element={
                user && !isUserDataLoading && userData && adminRole ? (
                  <Admin />
                ) : (
                  <Navigate to="/" />
                )
              }
            />

            {/* OTHERS */}
            <Route
              path="/frequently-asked-questions"
              element={<FAQComponent />}
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/privacy-policy" element={<Privacy />} />

            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        {/* scroll to top BTN */}
        <ScrollToTop
          color="black"
          smooth
          width="20"
          height="20"
          className="scrollToTopBtn"
        />

        {/* footer */}
        <Footer />

        {/* custom components */}
        <Toaster />
      </div>
    </ErrorBoundary>
  );
}

export default App;
