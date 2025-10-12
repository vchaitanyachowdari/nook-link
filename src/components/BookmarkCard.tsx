import { ExternalLink, Copy, Edit, Trash2, BookmarkCheck } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  tags: string[];
  reading: boolean;
  category?: string;
  created_at: string;
}

interface BookmarkCardProps {
  bookmark: Bookmark;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (id: string) => void;
  onToggleReading: (id: string, currentStatus: boolean) => void;
}

const TAG_COLORS = [
  "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
];

const getTagColor = (tag: string) => {
  const index = tag.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return TAG_COLORS[index % TAG_COLORS.length];
};

export const BookmarkCard = ({ bookmark, onEdit, onDelete, onToggleReading }: BookmarkCardProps) => {
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(bookmark.url);
    toast.success("URL copied to clipboard!");
  };

  return (
    <Card className="p-6 hover:shadow-md transition-all duration-200 bg-gradient-to-br from-card to-card/50">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-lg hover:text-primary transition-colors truncate"
            >
              {bookmark.title}
            </a>
            <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </div>

          {bookmark.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {bookmark.description}
            </p>
          )}

          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-muted-foreground font-mono truncate max-w-xs">
              {bookmark.url}
            </span>
            <Button variant="ghost" size="sm" onClick={handleCopyUrl} className="h-6 w-6 p-0">
              <Copy className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {bookmark.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className={getTagColor(tag)}>
                {tag}
              </Badge>
            ))}
            {bookmark.category && (
              <Badge variant="outline" className="border-primary/30">
                {bookmark.category}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant={bookmark.reading ? "default" : "outline"}
            size="sm"
            onClick={() => onToggleReading(bookmark.id, bookmark.reading)}
            className="w-full"
          >
            <BookmarkCheck className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(bookmark)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(bookmark.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
    </Card>
  );
};