import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";
import { Bookmark } from "./BookmarkCard";

interface BookmarkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Partial<Bookmark>) => void;
  bookmark?: Bookmark | null;
  allTags: string[];
}

export const BookmarkDialog = ({ open, onOpenChange, onSave, bookmark, allTags }: BookmarkDialogProps) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [reading, setReading] = useState(false);
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (bookmark) {
      setTitle(bookmark.title);
      setUrl(bookmark.url);
      setDescription(bookmark.description || "");
      setTags(bookmark.tags);
      setReading(bookmark.reading);
      setCategory(bookmark.category || "");
    } else {
      resetForm();
    }
  }, [bookmark, open]);

  const resetForm = () => {
    setTitle("");
    setUrl("");
    setDescription("");
    setTags([]);
    setTagInput("");
    setReading(false);
    setCategory("");
    setErrors({});
  };

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!url.trim()) {
      newErrors.url = "URL is required";
    } else if (!validateUrl(url)) {
      newErrors.url = "Please enter a valid URL";
    }
    if (tags.length === 0) {
      newErrors.tags = "At least one tag is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      title: title.trim(),
      url: url.trim(),
      description: description.trim() || undefined,
      tags,
      reading,
      category: category.trim() || undefined,
    });

    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{bookmark ? "Edit Bookmark" : "Add New Bookmark"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter bookmark title"
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL *</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
            />
            {errors.url && <p className="text-sm text-destructive">{errors.url}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description (optional)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags * (minimum 1)</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag(tagInput);
                  }
                }}
                placeholder="Type and press Enter"
              />
              <Button type="button" onClick={() => handleAddTag(tagInput)}>
                Add
              </Button>
            </div>
            {errors.tags && <p className="text-sm text-destructive">{errors.tags}</p>}
            
            {allTags.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-2">Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {allTags
                    .filter((tag) => !tags.includes(tag))
                    .slice(0, 8)
                    .map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-secondary"
                        onClick={() => handleAddTag(tag)}
                      >
                        + {tag}
                      </Badge>
                    ))}
                </div>
              </div>
            )}

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter category (optional)"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="reading"
              checked={reading}
              onCheckedChange={(checked) => setReading(checked as boolean)}
            />
            <Label htmlFor="reading" className="cursor-pointer">
              Add to Reading List
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {bookmark ? "Update" : "Add"} Bookmark
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};