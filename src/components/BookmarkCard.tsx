import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ExternalLink, Edit2, Trash2, BookOpen, BookOpenCheck, Star, Archive, ArchiveRestore } from "lucide-react";

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  tags: string[];
  reading: boolean;
  is_favorite?: boolean;
  is_archived?: boolean;
  category?: string;
  created_at: string;
  updated_at: string;
}

interface BookmarkCardProps {
  bookmark: Bookmark;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (id: string) => void;
  onToggleReading: (id: string, currentStatus: boolean) => void;
  onToggleFavorite?: (id: string, currentStatus: boolean) => void;
  onToggleArchive?: (id: string, currentStatus: boolean) => void;
}

export const BookmarkCard = ({ 
  bookmark, 
  onEdit, 
  onDelete, 
  onToggleReading,
  onToggleFavorite,
  onToggleArchive
}: BookmarkCardProps) => {
  return (
    <Card className={`p-6 hover:shadow-md transition-shadow ${bookmark.is_archived ? 'opacity-60 bg-muted/30' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="font-semibold text-lg">{bookmark.title}</h3>
            {bookmark.is_favorite && <span className="text-yellow-500 text-xl">⭐</span>}
            {bookmark.is_archived && (
              <Badge variant="secondary" className="shrink-0">
                <Archive className="h-3 w-3 mr-1" />
                Archived
              </Badge>
            )}
            {bookmark.reading && (
              <Badge variant="secondary" className="shrink-0">
                <BookOpen className="h-3 w-3 mr-1" />
                Reading
              </Badge>
            )}
            {bookmark.category && (
              <Badge variant="outline" className="shrink-0">
                {bookmark.category}
              </Badge>
            )}
          </div>

          {bookmark.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {bookmark.description}
            </p>
          )}

          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline mb-3 block truncate"
          >
            {bookmark.url}
          </a>

          <div className="flex flex-wrap gap-2">
            {bookmark.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2 shrink-0 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleReading(bookmark.id, bookmark.reading)}
            title={bookmark.reading ? "Remove from reading list" : "Add to reading list"}
          >
            {bookmark.reading ? (
              <BookOpenCheck className="h-4 w-4" />
            ) : (
              <BookOpen className="h-4 w-4" />
            )}
          </Button>
          {onToggleFavorite && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleFavorite(bookmark.id, bookmark.is_favorite || false)}
              title={bookmark.is_favorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className={`h-4 w-4 ${bookmark.is_favorite ? 'fill-yellow-500 text-yellow-500' : ''}`} />
            </Button>
          )}
          {onToggleArchive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleArchive(bookmark.id, bookmark.is_archived || false)}
              title={bookmark.is_archived ? "Unarchive" : "Archive"}
            >
              {bookmark.is_archived ? (
                <ArchiveRestore className="h-4 w-4" />
              ) : (
                <Archive className="h-4 w-4" />
              )}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(bookmark.url, "_blank")}
            title="Open link"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(bookmark)} title="Edit">
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(bookmark.id)}
            className="text-destructive hover:text-destructive"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
