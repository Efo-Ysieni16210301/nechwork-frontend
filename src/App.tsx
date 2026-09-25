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
import AdminOrdersPage, { AdminOrdersRouteError } from "./pages/AdminOrdersPage";
import VerifyAccountPage from "./pages/VerifyAccountPage";
import CustomerVerificationPage from "./pages/CustomerVerificationPage";
import { mergeProducts, products as fallbackProducts } from "./data/products";

async function loadCatalog() {
  try {
    const response = await api.get("/products");
    return mergeProducts(response.data);
  } catch {
    return fallbackProducts;
  }
}

const routes = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: loadCatalog,
      },
      {
        path: "shop",
        element: <ShopPage />,
        loader: loadCatalog,
      },
      { path: "gallery", element: <GalleryPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "verify-account", element: <VerifyAccountPage /> },
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
        errorElement: <AdminOrdersRouteError />,
      },
      {
        path: "admin/customers",
        element: <CustomerVerificationPage />,
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
