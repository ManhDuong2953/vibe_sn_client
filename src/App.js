import React, { Suspense, useEffect } from "react";
import routes from "./router/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./global/style.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { ImageProvider } from "./provider/image_context";
import {
  MdSignalWifiStatusbar4Bar,
  MdSignalWifiStatusbarConnectedNoInternet,
} from "react-icons/md";
import PrivateRoute from "./component/PrivateRouter/PrivateRouter";
import OwnDataProvider from "./provider/own_data";
import { SocketProvider } from "./provider/socket_context";
import Spinner from "./component/Spinner/spinner";
import BoxChatAI from "./component/BoxChatAPI/box_chat_ai";

function App() {
  const theme = useSelector((state) => state.themeUI.theme);
  const root = document.querySelector(":root");
  useEffect(() => {
    const handleOnline = () => {
      toast.success("Trình duyệt đã trực tuyến", {
        duration: 60000,
        icon: <MdSignalWifiStatusbar4Bar />,
        position: "bottom-left",
      });
    };

    const handleOffline = () => {
      toast.error("Trình duyệt đang ngoại tuyến", {
        duration: 60000,
        icon: <MdSignalWifiStatusbarConnectedNoInternet />,
        position: "bottom-left",
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.setAttribute("data-theme", "light");
    }
    root.style.transition = "all .5s ease";
  }, [theme, root]);

  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
      />
      <Suspense
        fallback={
          <div>
            <Spinner />
          </div>
        }
      >
        <Router>
          <Routes>
            {routes.map((route, index) => {
              if (route.requireAuth) {
                return (
                  <Route key={index} element={<PrivateRoute />}>
                    <Route
                      path={route.path}
                      exact={route.exact}
                      element={
                        <OwnDataProvider>
                          <SocketProvider>
                            <ImageProvider>{route.component}</ImageProvider>
                          </SocketProvider>
                          <BoxChatAI />
                        </OwnDataProvider>
                      }
                    />
                  </Route>
                );
              }
              return (
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  element={route.component}
                />
              );
            })}
          </Routes>
        </Router>
      </Suspense>
      <div id="overlay"></div>
    </div>
  );
}

export default App;
