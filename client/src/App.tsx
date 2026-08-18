import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { StoreProvider } from "./contexts/StoreContext";
import Home from "./pages/Home";
import Journal from "./pages/Journal";
import SpecialOffers from "./pages/SpecialOffers";
import AboutPage from "./pages/About";
import ShippingPage from "./pages/Shipping";
import ContactPage from "./pages/Contact";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout, { OrderSuccess } from "./pages/Checkout";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { Route, Switch } from "wouter";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "wouter";



function Router() {
  return <Switch><Route path="/" component={Home} /><Route path="/shop" component={Shop} /><Route path="/product/:slug" component={ProductDetail} /><Route path="/cart" component={Cart} /><Route path="/checkout" component={Checkout} /><Route path="/order-success/:id" component={OrderSuccess} /><Route path="/orders" component={Orders} /><Route path="/about" component={AboutPage} /><Route path="/shipping" component={ShippingPage} /><Route path="/contact" component={ContactPage} /><Route path="/journal" component={Journal} /><Route path="/special-offers" component={SpecialOffers} /><Route path="/admin" component={Admin} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><StoreProvider><TooltipProvider><Toaster /><Router /></TooltipProvider></StoreProvider></ThemeProvider></ErrorBoundary>;
}
