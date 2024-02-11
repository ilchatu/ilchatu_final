// import "./App.css";
// import { Route } from "react-router-dom";
// import Homepage from "./Pages/Homepage";
// import ChatPage from "./Pages/ChatPage";
// import VerifyEmail from "./components/VerifyEmail";
// import ForgetPassword from './components/Authentication/ForgetPassword';

// function App() {
//   return (
//     <div className="App">
//       <Route path="/" component={Homepage} exact />
//       <Route path="/chats" component={ChatPage} />
//       <Route path="/verify-email/:token" component={VerifyEmail} />
//       <Route path="/forgetPassword" component={<ForgetPassword />} />

//     </div>
//   );
// }

// export default App;
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import ChatPage from "./Pages/ChatPage";
import AdminPage from "./Pages/AdminPage";
import VerifyEmail from "./components/VerifyEmail";
import ForgetPassword from "./components/Authentication/ForgetPassword";
import ResetNewPassword from "./components/Authentication/ResetNewPassword";
import { AdminRoute } from "./routes/AdminRoute";

function App() {
  return (
    <div className="App">
      <Router>
        <Route path="/" component={Homepage} exact />
        <Route path="/chats" component={ChatPage} />
        <AdminRoute path="/admin">
          <AdminPage />
        </AdminRoute>
        <Route path="/verify-email/:token" component={VerifyEmail} />
        <Route path="/forgetPassword" component={ForgetPassword} />
        <Route
          path="/ResetNewPassword/:param1/:param2"
          component={ResetNewPassword}
        />
      </Router>
    </div>
  );
}

export default App;
