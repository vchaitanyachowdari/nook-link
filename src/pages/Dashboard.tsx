import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { BookmarkCard, Bookmark } from "@/components/BookmarkCard";
import { BookmarkDialog } from "@/components/BookmarkDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, Search, Filter, BookOpen } from "lucide-react";
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

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [readingOnly, setReadingOnly] = useState(false);
  const [allTags, setAllTags] = useState<string[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
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
      fetchBookmarks();
    }
  }, [user]);

  useEffect(() => {
    filterBookmarks();
  }, [bookmarks, searchQuery, selectedTags, readingOnly]);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
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
      toast.error("Error fetching bookmarks");
    } finally {
      setLoading(false);
    }
  };

  const filterBookmarks = () => {
    let filtered = [...bookmarks];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(query) ||
          b.description?.toLowerCase().includes(query) ||
          b.url.toLowerCase().includes(query)
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((b) =>
        selectedTags.some((tag) => b.tags.includes(tag))
      );
    }

    if (readingOnly) {
      filtered = filtered.filter((b) => b.reading);
    }

    setFilteredBookmarks(filtered);
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
      } else {
        const { error } = await supabase.from("bookmarks").insert([{
          title: data.title!,
          url: data.url!,
          description: data.description,
          tags: data.tags || [],
          reading: data.reading || false,
          category: data.category,
          user_id: user.id,
        }]);

        if (error) throw error;
        toast.success("Bookmark added successfully!");
      }

      fetchBookmarks();
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
      fetchBookmarks();
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
      toast.success(
        currentStatus ? "Removed from reading list" : "Added to reading list"
      );
      fetchBookmarks();
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
            <p className="text-muted-foreground">Loading bookmarks...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userEmail={user?.email}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">All Bookmarks</h2>
            <p className="text-muted-foreground mt-1">
              {filteredBookmarks.length} bookmark{filteredBookmarks.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <Button onClick={() => { setEditingBookmark(null); setDialogOpen(true); }} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Add New Bookmark
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Filters & Search</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by title, URL, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Filter by Tags</Label>
              <Select
                value={selectedTags[0] || ""}
                onValueChange={(value) => {
                  if (value === "all") {
                    setSelectedTags([]);
                  } else {
                    setSelectedTags([value]);
                  }
                }}
              >
                <SelectTrigger id="tags">
                  <SelectValue placeholder="All tags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All tags</SelectItem>
                  {allTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="reading"
                  checked={readingOnly}
                  onCheckedChange={(checked) => setReadingOnly(checked as boolean)}
                />
                <Label htmlFor="reading" className="cursor-pointer flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Reading List Only
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Bookmarks Grid */}
        {filteredBookmarks.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-lg">
            <div className="mb-4">
              <Plus className="h-16 w-16 mx-auto text-muted-foreground/30" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No bookmarks found</h3>
            <p className="text-muted-foreground mb-6">
              {bookmarks.length === 0
                ? "Click 'Add New Bookmark' to get started!"
                : "Try adjusting your filters or search query"}
            </p>
            {bookmarks.length === 0 && (
              <Button onClick={() => { setEditingBookmark(null); setDialogOpen(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Bookmark
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredBookmarks.map((bookmark) => (
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