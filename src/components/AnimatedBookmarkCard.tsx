import { motion } from "framer-motion";
import { ExternalLink, Copy, Edit, Trash2, BookmarkCheck, Star, Archive, FolderOpen, StickyNote } from "lucide-react";
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
  is_favorite?: boolean;
  is_archived?: boolean;
  category?: string;
  created_at: string;
  updated_at: string;
  notes?: string;
  folder?: string;
}

interface AnimatedBookmarkCardProps {
  bookmark: Bookmark;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (id: string) => void;
  onToggleReading: (id: string, currentStatus: boolean) => void;
  onToggleFavorite?: (id: string, currentStatus: boolean) => void;
  onToggleArchive?: (id: string, currentStatus: boolean) => void;
  index: number;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
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

export const AnimatedBookmarkCard = ({ 
  bookmark, 
  onEdit, 
  onDelete, 
  onToggleReading,
  onToggleFavorite,
  onToggleArchive,
  index,
  isSelected,
  onToggleSelect
}: AnimatedBookmarkCardProps) => {
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(bookmark.url);
    toast.success("URL copied to clipboard!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1]
      }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className={`
        group relative p-6 h-full
        transition-all duration-300
        bg-gradient-to-br from-card via-card to-card/50
        hover:shadow-lg hover:shadow-primary/10
        border-l-4 
        ${bookmark.is_favorite ? 'border-l-accent shadow-colored' : 'border-l-transparent'} 
        ${bookmark.is_archived ? 'opacity-60' : ''}
        ${isSelected ? 'ring-2 ring-primary shadow-glow' : ''}
      `}>
        {/* Selection overlay */}
        {isSelected && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-primary/5 rounded-lg pointer-events-none"
          />
        )}

        <div className="flex items-start justify-between gap-4 relative">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              {onToggleSelect && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onToggleSelect(bookmark.id)}
                  className={`
                    flex-shrink-0 w-5 h-5 rounded border-2 transition-all
                    ${isSelected 
                      ? 'bg-primary border-primary' 
                      : 'border-muted-foreground/30 hover:border-primary'
                    }
                  `}
                >
                  {isSelected && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-full h-full text-primary-foreground"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="M6 10L9 13L14 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  )}
                </motion.button>
              )}
              
              {bookmark.is_favorite && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  <Star className="h-4 w-4 fill-accent text-accent flex-shrink-0" />
                </motion.div>
              )}
              
              {bookmark.is_archived && (
                <Archive className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
              
              <motion.a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-lg hover:text-primary transition-colors truncate group-hover:text-gradient-primary"
                whileHover={{ x: 2 }}
              >
                {bookmark.title}
              </motion.a>
              
              <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {bookmark.description && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 + 0.1 }}
                className="text-sm text-muted-foreground mb-3 line-clamp-2"
              >
                {bookmark.description}
              </motion.p>
            )}

            {bookmark.notes && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 + 0.15 }}
                className="flex items-start gap-2 mb-3 p-3 bg-muted/50 rounded-lg border border-border/50"
              >
                <StickyNote className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground line-clamp-2">{bookmark.notes}</p>
              </motion.div>
            )}

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-muted-foreground font-mono truncate max-w-xs opacity-60 group-hover:opacity-100 transition-opacity">
                {bookmark.url}
              </span>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="sm" onClick={handleCopyUrl} className="h-6 w-6 p-0">
                  <Copy className="h-3 w-3" />
                </Button>
              </motion.div>
            </div>

            <motion.div 
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 + 0.2 }}
            >
              {bookmark.folder && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <Badge variant="outline" className="border-primary/50 gap-1 hover:bg-primary/10 transition-colors">
                    <FolderOpen className="h-3 w-3" />
                    {bookmark.folder}
                  </Badge>
                </motion.div>
              )}
              {bookmark.tags.map((tag, tagIndex) => (
                <motion.div
                  key={tag}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    delay: index * 0.05 + 0.2 + tagIndex * 0.05,
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Badge variant="secondary" className={`${getTagColor(tag)} transition-transform cursor-default`}>
                    {tag}
                  </Badge>
                </motion.div>
              ))}
              {bookmark.category && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <Badge variant="outline" className="border-accent/30 hover:bg-accent/10 transition-colors">
                    {bookmark.category}
                  </Badge>
                </motion.div>
              )}
            </motion.div>
          </div>

          <div className="flex flex-col gap-2">
            {onToggleFavorite && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={bookmark.is_favorite ? "default" : "outline"}
                  size="sm"
                  onClick={() => onToggleFavorite(bookmark.id, bookmark.is_favorite || false)}
                  className={`w-full ${bookmark.is_favorite ? 'shadow-glow' : ''}`}
                  title="Toggle Favorite"
                >
                  <Star className={`h-4 w-4 ${bookmark.is_favorite ? 'fill-current' : ''}`} />
                </Button>
              </motion.div>
            )}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant={bookmark.reading ? "default" : "outline"}
                size="sm"
                onClick={() => onToggleReading(bookmark.id, bookmark.reading)}
                className="w-full"
                title="Toggle Reading List"
              >
                <BookmarkCheck className="h-4 w-4" />
              </Button>
            </motion.div>
            {onToggleArchive && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={bookmark.is_archived ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => onToggleArchive(bookmark.id, bookmark.is_archived || false)}
                  className="w-full"
                  title="Toggle Archive"
                >
                  <Archive className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="sm" onClick={() => onEdit(bookmark)} title="Edit">
                <Edit className="h-4 w-4" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="sm" onClick={() => onDelete(bookmark.id)} title="Delete">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
