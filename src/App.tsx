import { createBrowserRouter, RouterProvider } from "react-router-dom";
import type { LoaderFunctionArgs } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ArticlesList from "./pages/ArticlesListPage";
import ArticlePage from "./pages/ArticlePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotFound from "./pages/NotFound";
import Layout from "./Layout";
import api from "./api/client";

const routes = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      {
        path: "articles",
        element: <ArticlesList />,
        loader: async () => {
          const res = await api.get("/articles");
          return res.data;
        },
      },
      {
        path: "articles/:name",
        element: <ArticlePage />,
        loader: async ({ params }: LoaderFunctionArgs) => {
          const res = await api.get(`/articles/${params.name}`);
          return res.data;
        },
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default function App() {
  return <RouterProvider router={router} />;
}
