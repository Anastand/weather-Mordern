import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

interface Favorite {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
}

export function SidebarFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  // Load favorites from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Favorites</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {favorites.length === 0 && (
                <SidebarMenuItem>
                  <SidebarMenuButton disabled>
                    No favorites yet
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {favorites.map((fav, i) => (
                <SidebarMenuItem key={i}>
                  <SidebarMenuButton asChild>
                    <Link to={`/detail?city=${encodeURIComponent(fav.name)}`}>
                      {fav.name} {fav.country ? `(${fav.country})` : ""}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
