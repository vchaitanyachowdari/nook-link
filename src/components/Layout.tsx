import { ReactNode, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { BookmarkPlus, List, BookOpen, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface LayoutProps {
  children: ReactNode;
  userEmail?: string;
}

export const Layout = ({ children, userEmail }: LayoutProps) => {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (userEmail) {
      loadProfile();
    }
  }, [userEmail]);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileData?.avatar_url && !profileData.avatar_url.startsWith("http")) {
        const { data: signedUrlData } = await supabase.storage
          .from("avatars")
          .createSignedUrl(profileData.avatar_url, 3600);
        
        setProfile({ ...profileData, avatar_url: signedUrlData?.signedUrl || "" });
      } else {
        setProfile(profileData);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
                <BookmarkPlus className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Nook Link
              </h1>
            </Link>

            <nav className="flex items-center gap-2">
              <Link to="/">
                <Button variant="ghost" size="sm" className="relative group">
                  <List className="h-4 w-4 mr-2" />
                  All Bookmarks
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                </Button>
              </Link>
              <Link to="/reading-list">
                <Button variant="ghost" size="sm" className="relative group">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Reading List
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                </Button>
              </Link>
              <Link to="/docs">
                <Button variant="ghost" size="sm" className="relative group">
                  <BookmarkPlus className="h-4 w-4 mr-2" />
                  Docs
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                </Button>
              </Link>
              
              {userEmail && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative ml-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url} />
                        <AvatarFallback className="text-xs bg-gradient-to-br from-primary to-accent text-primary-foreground">
                          {profile?.display_name?.[0] || userEmail?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{profile?.display_name || "User"}</p>
                        <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer w-full">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer w-full">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};
