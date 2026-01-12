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