import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { BookmarkCard, Bookmark } from "@/components/BookmarkCard";
import { BookmarkDialog } from "@/components/BookmarkDialog";
import { BookOpen } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ReadingList() {
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchReadingList();
    }
  }, [user]);

  const fetchReadingList = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("reading", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setBookmarks(data || []);

      // Extract all unique tags
      const tags = new Set<string>();
      data?.forEach((bookmark) => {
        bookmark.tags?.forEach((tag: string) => tags.add(tag));
      });
      setAllTags(Array.from(tags).sort());
    } catch (error: any) {
      toast.error("Error fetching reading list");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBookmark = async (data: Partial<Bookmark>) => {
    try {
      if (editingBookmark) {
        const { error } = await supabase
          .from("bookmarks")
          .update(data)
          .eq("id", editingBookmark.id);

        if (error) throw error;
        toast.success("Bookmark updated successfully!");
      }

      fetchReadingList();
      setEditingBookmark(null);
    } catch (error: any) {
      toast.error(error.message || "Error saving bookmark");
    }
  };

  const handleDeleteBookmark = async () => {
    if (!deletingId) return;

    try {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("id", deletingId);

      if (error) throw error;
      toast.success("Bookmark deleted successfully!");
      fetchReadingList();
    } catch (error: any) {
      toast.error("Error deleting bookmark");
    } finally {
      setDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  const handleToggleReading = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("bookmarks")
        .update({ reading: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      toast.success("Removed from reading list");
      fetchReadingList();
    } catch (error: any) {
      toast.error("Error updating bookmark");
    }
  };

  const confirmDelete = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <Layout userEmail={user?.email}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading reading list...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userEmail={user?.email}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-accent">
            <BookOpen className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Reading List</h2>
            <p className="text-muted-foreground mt-1">
              {bookmarks.length} item{bookmarks.length !== 1 ? "s" : ""} to read
            </p>
          </div>
        </div>

        {/* Bookmarks Grid */}
        {bookmarks.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-lg">
            <div className="mb-4">
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/30" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Your reading list is empty</h3>
            <p className="text-muted-foreground">
              Add bookmarks and mark them for reading to see them here!
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onEdit={(b) => {
                  setEditingBookmark(b);
                  setDialogOpen(true);
                }}
                onDelete={confirmDelete}
                onToggleReading={handleToggleReading}
              />
            ))}
          </div>
        )}
      </div>

      <BookmarkDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveBookmark}
        bookmark={editingBookmark}
        allTags={allTags}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Bookmark</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this bookmark? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBookmark}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}