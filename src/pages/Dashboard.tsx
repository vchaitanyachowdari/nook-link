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
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [sortBy, setSortBy] = useState("created_at_desc");
  const [selectedBookmarks, setSelectedBookmarks] = useState<Set<string>>(new Set());
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
  }, [bookmarks, searchQuery, selectedTags, readingOnly, favoriteOnly, showArchived, sortBy]);

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

    // Filter archived
    if (!showArchived) {
      filtered = filtered.filter((b) => !b.is_archived);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(query) ||
          b.description?.toLowerCase().includes(query) ||
          b.url.toLowerCase().includes(query) ||
          b.tags.some(tag => tag.toLowerCase().includes(query))
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

    if (favoriteOnly) {
      filtered = filtered.filter((b) => b.is_favorite);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "created_at_desc":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "created_at_asc":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "title_asc":
          return a.title.localeCompare(b.title);
        case "title_desc":
          return b.title.localeCompare(a.title);
        case "updated_at_desc":
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        default:
          return 0;
      }
    });

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

  const handleToggleFavorite = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("bookmarks")
        .update({ is_favorite: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      toast.success(
        currentStatus ? "Removed from favorites" : "Added to favorites"
      );
      fetchBookmarks();
    } catch (error: any) {
      toast.error("Error updating bookmark");
    }
  };

  const handleToggleArchive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("bookmarks")
        .update({ is_archived: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      toast.success(
        currentStatus ? "Unarchived bookmark" : "Archived bookmark"
      );
      fetchBookmarks();
    } catch (error: any) {
      toast.error("Error updating bookmark");
    }
  };

  const handleBulkArchive = async () => {
    try {
      const ids = Array.from(selectedBookmarks);
      const { error } = await supabase
        .from("bookmarks")
        .update({ is_archived: true })
        .in("id", ids);

      if (error) throw error;
      toast.success(`Archived ${ids.length} bookmark(s)`);
      setSelectedBookmarks(new Set());
      fetchBookmarks();
    } catch (error: any) {
      toast.error("Error archiving bookmarks");
    }
  };

  const handleBulkDelete = async () => {
    try {
      const ids = Array.from(selectedBookmarks);
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .in("id", ids);

      if (error) throw error;
      toast.success(`Deleted ${ids.length} bookmark(s)`);
      setSelectedBookmarks(new Set());
      fetchBookmarks();
    } catch (error: any) {
      toast.error("Error deleting bookmarks");
    }
  };

  const handleBulkAddToReading = async () => {
    try {
      const ids = Array.from(selectedBookmarks);
      const { error } = await supabase
        .from("bookmarks")
        .update({ reading: true })
        .in("id", ids);

      if (error) throw error;
      toast.success(`Added ${ids.length} bookmark(s) to reading list`);
      setSelectedBookmarks(new Set());
      fetchBookmarks();
    } catch (error: any) {
      toast.error("Error updating bookmarks");
    }
  };

  const toggleSelectBookmark = (id: string) => {
    const newSelected = new Set(selectedBookmarks);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedBookmarks(newSelected);
  };

  const selectAll = () => {
    if (selectedBookmarks.size === filteredBookmarks.length) {
      setSelectedBookmarks(new Set());
    } else {
      setSelectedBookmarks(new Set(filteredBookmarks.map(b => b.id)));
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
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold">All Bookmarks</h2>
            <p className="text-muted-foreground mt-1">
              {filteredBookmarks.length} bookmark{filteredBookmarks.length !== 1 ? "s" : ""} found
              {selectedBookmarks.size > 0 && ` (${selectedBookmarks.size} selected)`}
            </p>
          </div>
          <div className="flex gap-2">
            {selectedBookmarks.size > 0 && (
              <>
                <Button onClick={handleBulkAddToReading} variant="outline" size="sm">
                  Add to Reading
                </Button>
                <Button onClick={handleBulkArchive} variant="outline" size="sm">
                  Archive Selected
                </Button>
                <Button onClick={handleBulkDelete} variant="destructive" size="sm">
                  Delete Selected
                </Button>
              </>
            )}
            <Button onClick={() => { setEditingBookmark(null); setDialogOpen(true); }} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Add Bookmark
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Filters & Search</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by title, URL, description, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sort">Sort By</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger id="sort">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at_desc">Newest First</SelectItem>
                    <SelectItem value="created_at_asc">Oldest First</SelectItem>
                    <SelectItem value="updated_at_desc">Recently Updated</SelectItem>
                    <SelectItem value="title_asc">Title (A-Z)</SelectItem>
                    <SelectItem value="title_desc">Title (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    Reading List
                  </Label>
                </div>
              </div>

              <div className="flex items-end">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="favorite"
                    checked={favoriteOnly}
                    onCheckedChange={(checked) => setFavoriteOnly(checked as boolean)}
                  />
                  <Label htmlFor="favorite" className="cursor-pointer">
                    ⭐ Favorites Only
                  </Label>
                </div>
              </div>

              <div className="flex items-end">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="archived"
                    checked={showArchived}
                    onCheckedChange={(checked) => setShowArchived(checked as boolean)}
                  />
                  <Label htmlFor="archived" className="cursor-pointer">
                    📦 Show Archived
                  </Label>
                </div>
              </div>
            </div>

            {filteredBookmarks.length > 0 && (
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectAll}
                >
                  {selectedBookmarks.size === filteredBookmarks.length ? "Deselect All" : "Select All"}
                </Button>
              </div>
            )}
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
              <div key={bookmark.id} className="flex items-start gap-3">
                <Checkbox
                  checked={selectedBookmarks.has(bookmark.id)}
                  onCheckedChange={() => toggleSelectBookmark(bookmark.id)}
                  className="mt-6"
                />
                <div className="flex-1">
                  <BookmarkCard
                    bookmark={bookmark}
                    onEdit={(b) => {
                      setEditingBookmark(b);
                      setDialogOpen(true);
                    }}
                    onDelete={confirmDelete}
                    onToggleReading={handleToggleReading}
                    onToggleFavorite={handleToggleFavorite}
                    onToggleArchive={handleToggleArchive}
                  />
                </div>
              </div>
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