import { Route, Routes, useNavigate, Link } from "react-router-dom";
import Home from "./pages/Home";
import Details from "./pages/Details";
import { Toaster } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X, Home as HomeIcon } from "lucide-react";
import { useFavorites } from "./context/FavoritesContext";
import { useState } from "react";

function App() {
  const { favorites, removeFavorite } = useFavorites();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // 👈 control Sheet state

  return (
    <>
      {/* Floating toggle + home buttons */}
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        {/* Sidebar Toggle */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="rounded-full shadow-md bg-white/30 backdrop-blur-md border border-white/40 text-foreground hover:bg-white/40 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-64 bg-white/20 backdrop-blur-lg border border-white/20 text-white"
          >
            <h2 className="text-lg font-bold mb-4">Favorites</h2>
            {favorites.length === 0 ? (
              <p className="text-sm text-gray-200">No favorites yet</p>
            ) : (
              <ul className="space-y-2">
                {favorites.map((city, i) => (
                  <li
                    key={i}
                    className="flex justify-between items-center bg-white/10 backdrop-blur-sm p-2 rounded-md cursor-pointer hover:bg-white/20"
                    onClick={() => {
                      navigate(`/detail?city=${encodeURIComponent(city)}`);
                      setOpen(false); // 👈 close sidebar after navigation
                    }}
                  >
                    <span>{city}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-red-400 hover:bg-white/20"
                      onClick={(e) => {
                        e.stopPropagation(); // 👈 prevent navigation when deleting
                        removeFavorite(city);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </SheetContent>
        </Sheet>

        {/* Home Button */}
        <Link to="/">
          <Button
            size="icon"
            className="rounded-full shadow-md bg-white/30 backdrop-blur-md border border-white/40 text-foreground hover:bg-white/40 transition-colors"
          >
            <HomeIcon className="h-5 w-5" />
          </Button>
        </Link>
      </div>

      {/* Main Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail" element={<Details />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
