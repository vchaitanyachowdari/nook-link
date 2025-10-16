import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Search, X } from "lucide-react";
import { Button } from "./ui/button";

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedFolder: string;
  onFolderChange: (value: string) => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  availableFolders: string[];
  availableTags: string[];
  showArchived: boolean;
  onShowArchivedChange: (value: boolean) => void;
  showFavorites: boolean;
  onShowFavoritesChange: (value: boolean) => void;
}

export const FilterBar = ({
  searchTerm,
  onSearchChange,
  selectedFolder,
  onFolderChange,
  selectedTags,
  onTagToggle,
  availableFolders,
  availableTags,
  showArchived,
  onShowArchivedChange,
  showFavorites,
  onShowFavoritesChange,
}: FilterBarProps) => {
  return (
    <div className="space-y-4 p-4 bg-card/50 rounded-lg border">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookmarks..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={selectedFolder} onValueChange={onFolderChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Folders" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Folders</SelectItem>
            {availableFolders.map((folder) => (
              <SelectItem key={folder} value={folder}>
                {folder}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant={showFavorites ? "default" : "outline"}
            size="sm"
            onClick={() => onShowFavoritesChange(!showFavorites)}
          >
            Favorites Only
          </Button>
          <Button
            variant={showArchived ? "secondary" : "outline"}
            size="sm"
            onClick={() => onShowArchivedChange(!showArchived)}
          >
            Show Archived
          </Button>
        </div>
      </div>

      {availableTags.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Filter by tags:</span>
          {availableTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/20 transition-colors"
              onClick={() => onTagToggle(tag)}
            >
              {tag}
              {selectedTags.includes(tag) && <X className="h-3 w-3 ml-1" />}
            </Badge>
          ))}
        </div>
      )}

      {(searchTerm || selectedFolder !== "all" || selectedTags.length > 0 || showFavorites) && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Active filters:</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onSearchChange("");
              onFolderChange("all");
              selectedTags.forEach(tag => onTagToggle(tag));
              onShowFavoritesChange(false);
            }}
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};
