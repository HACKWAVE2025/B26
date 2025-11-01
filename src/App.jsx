import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";

import DashboardPage from "./Components/Dashboard";
import LoginSignup from "./Components/LoginSignup";
import IntegrationsPage from "./Components/IntegrationsPage";
import WorkFlows from "./Components/WorkFlows";
import ProcessSteps from "./Components/ProcessSteps";

const App = () => {
  const [user, setUser] = useState(null);

  // ✅ Load user from localStorage when app starts
  useEffect(() => {
    const storedUser = localStorage.getItem("agentog_user");
    if (storedUser) {
      console.log(storedUser)
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser({ email: storedUser });
      }
    }
  }, []);

  // ✅ Logout handler
  const handleSignOut = () => {
    localStorage.removeItem("agentog_user");
    setUser(null);
  };

  return (
    <Router>
      <Routes>
          <Route
          path="/"
          element={<Home/>}
        />
        <Route path="/dashboard" element={<DashboardPage user={user}  onSignOut = {handleSignOut}  />} />
        <Route path="/integrations" element={<IntegrationsPage />} />
        <Route path="/auth" element={<LoginSignup />} />
        <Route path="/workflows" element={<WorkFlows />} />
         <Route path="/setup-process" element={<ProcessSteps />} />
      
      </Routes>
    </Router>
  );
};

export default App;
