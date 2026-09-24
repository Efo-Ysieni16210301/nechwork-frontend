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
import AdminPage from "./pages/AdminPage";
import ShopPage from "./pages/ShopPage";
import GalleryPage from "./pages/GalleryPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProductAdminPage from "./pages/ProductAdminPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";

const routes = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "shop",
        element: <ShopPage />,
        loader: async () => {
          const res = await api.get("/products");
          return res.data;
        },
      },
      { path: "gallery", element: <GalleryPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> },
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
        path: "admin",
        element: <AdminPage />,
        loader: async () => {
          const res = await api.get("/articles");
          return res.data;
        },
      },
      {
        path: "admin/products",
        element: <ProductAdminPage />,
        loader: async () => {
          const res = await api.get("/products");
          return res.data;
        },
      },
      {
        path: "admin/orders",
        element: <AdminOrdersPage />,
        loader: async () => {
          const res = await api.get("/admin/orders");
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
