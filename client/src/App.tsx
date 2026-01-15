import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import SearchPage from "@/pages/SearchPage";
import GiftsPage from "@/pages/GiftsPage";
import SubscriptionPage from "@/pages/SubscriptionPage";
import EventsPage from "@/pages/EventsPage";
import MyPage from "@/pages/MyPage";
import StoryDetailPage from "@/pages/StoryDetailPage";
import EventDetailPage from "@/pages/EventDetailPage";
import AdminPage from "@/pages/AdminPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import MyReviewsPage from "@/pages/MyReviewsPage";
import CorporateInquiryPage from "@/pages/CorporateInquiryPage";
import MyWishlistPage from "@/pages/MyWishlistPage";
import MyRecentProductsPage from "@/pages/MyRecentProductsPage";
import MyPaymentPage from "@/pages/MyPaymentPage";
import MyShippingPage from "@/pages/MyShippingPage";
import MyNotificationsPage from "@/pages/MyNotificationsPage";
import NoticePage from "@/pages/NoticePage";
import FAQPage from "@/pages/FAQPage";
import MyInquiryPage from "@/pages/MyInquiryPage";
import JangsuBrandPage from "@/pages/JangsuBrandPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/search" component={SearchPage} />
      <Route path="/gifts" component={GiftsPage} />
      <Route path="/subscription" component={SubscriptionPage} />
      <Route path="/events" component={EventsPage} />
      <Route path="/mypage" component={MyPage} />
      <Route path="/story/:id" component={StoryDetailPage} />
      <Route path="/events/:id" component={EventDetailPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/mypage/reviews" component={MyReviewsPage} />
      <Route path="/corporate-inquiry" component={CorporateInquiryPage} />
      <Route path="/mypage/wishlist" component={MyWishlistPage} />
      <Route path="/mypage/recent" component={MyRecentProductsPage} />
      <Route path="/mypage/payment" component={MyPaymentPage} />
      <Route path="/mypage/shipping" component={MyShippingPage} />
      <Route path="/mypage/notifications" component={MyNotificationsPage} />
      <Route path="/notices" component={NoticePage} />
      <Route path="/faq" component={FAQPage} />
      <Route path="/inquiry" component={MyInquiryPage} />
      <Route path="/jangsu-brand" component={JangsuBrandPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;