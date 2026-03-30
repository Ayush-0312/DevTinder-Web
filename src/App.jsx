import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./components/Body";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Landing from "./components/Landing";
import { Toaster } from "react-hot-toast";
import { lazy, Suspense } from "react";
import Loader from "./components/Loader";

const Feed = lazy(() => import("./components/Feed"));
const Login = lazy(() => import("./components/Login"));
const Profile = lazy(() => import("./components/Profile"));
const Connections = lazy(() => import("./components/Connections"));
const Requests = lazy(() => import("./components/Requests"));
const Chat = lazy(() => import("./components/Chat"));

function App() {
  return (
    <Provider store={appStore}>
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Body />}>
            <Route path="/" element={<Landing />} />

            <Route
              path="/feed"
              element={
                <Suspense fallback={<Loader />}>
                  <Feed />
                </Suspense>
              }
            />

            <Route
              path="/login"
              element={
                <Suspense fallback={<Loader />}>
                  <Login />
                </Suspense>
              }
            />

            <Route
              path="/profile"
              element={
                <Suspense fallback={<Loader />}>
                  <Profile />
                </Suspense>
              }
            />

            <Route
              path="/connections"
              element={
                <Suspense fallback={<Loader />}>
                  <Connections />
                </Suspense>
              }
            />

            <Route
              path="/requests"
              element={
                <Suspense fallback={<Loader />}>
                  <Requests />
                </Suspense>
              }
            />

            <Route
              path="/chat/:targetUserId"
              element={
                <Suspense fallback={<Loader />}>
                  <Chat />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
