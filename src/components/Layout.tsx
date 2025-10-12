import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { BookmarkPlus, LogOut, List, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LayoutProps {
  children: ReactNode;
  userEmail?: string;
}

export const Layout = ({ children, userEmail }: LayoutProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
      return;
    }
    toast.success("Signed out successfully");
    navigate("/auth");
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
                Bookmarks Manager
              </h1>
            </Link>

            <nav className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <List className="h-4 w-4 mr-2" />
                  All Bookmarks
                </Button>
              </Link>
              <Link to="/reading-list">
                <Button variant="ghost" size="sm">
                  <BookmarkPlus className="h-4 w-4 mr-2" />
                  Reading List
                </Button>
              </Link>
              
              {userEmail && (
                <div className="flex items-center gap-3 ml-4 pl-4 border-l">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    {userEmail}
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
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