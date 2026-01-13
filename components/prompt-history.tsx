'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { History, Star, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

interface PromptHistoryProps {
  onSelectPrompt: (prompt: string) => void
  currentPrompt: string
  disabled?: boolean
}

interface SavedPrompt {
  prompt: string
  timestamp: number
  isFavorite: boolean
}

const STORAGE_KEY = 'render-ai-prompt-history'
const MAX_HISTORY = 20

export function PromptHistory({ onSelectPrompt, currentPrompt, disabled }: PromptHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [history, setHistory] = useState<SavedPrompt[]>([])

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setHistory(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Failed to load prompt history:', e)
    }
  }, [])

  // Save history to localStorage
  const saveHistory = (newHistory: SavedPrompt[]) => {
    setHistory(newHistory)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
    } catch (e) {
      console.error('Failed to save prompt history:', e)
    }
  }

  // Save current prompt to history
  const saveCurrentPrompt = () => {
    if (!currentPrompt.trim()) return

    const existingIndex = history.findIndex(h => h.prompt === currentPrompt.trim())
    let newHistory: SavedPrompt[]

    if (existingIndex >= 0) {
      // Update timestamp of existing prompt
      newHistory = [...history]
      newHistory[existingIndex] = {
        ...newHistory[existingIndex],
        timestamp: Date.now(),
      }
    } else {
      // Add new prompt
      newHistory = [
        { prompt: currentPrompt.trim(), timestamp: Date.now(), isFavorite: false },
        ...history,
      ].slice(0, MAX_HISTORY)
    }

    saveHistory(newHistory)
  }

  // Toggle favorite status
  const toggleFavorite = (index: number) => {
    const newHistory = [...history]
    newHistory[index] = {
      ...newHistory[index],
      isFavorite: !newHistory[index].isFavorite,
    }
    saveHistory(newHistory)
  }

  // Delete a prompt from history
  const deletePrompt = (index: number) => {
    const newHistory = history.filter((_, i) => i !== index)
    saveHistory(newHistory)
  }

  // Clear all non-favorite prompts
  const clearHistory = () => {
    const newHistory = history.filter(h => h.isFavorite)
    saveHistory(newHistory)
  }

  // Sort history: favorites first, then by timestamp
  const sortedHistory = [...history].sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) return b.isFavorite ? 1 : -1
    return b.timestamp - a.timestamp
  })

  const favoriteCount = history.filter(h => h.isFavorite).length

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
        disabled={disabled}
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          <History className="h-4 w-4" />
          Prompt History
          {history.length > 0 && (
            <span className="text-xs text-muted-foreground">
              ({history.length} saved{favoriteCount > 0 ? `, ${favoriteCount} starred` : ''})
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
          {/* Save current button */}
          {currentPrompt.trim() && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={saveCurrentPrompt}
              disabled={disabled}
              className="w-full"
            >
              <Star className="h-3 w-3 mr-2" />
              Save Current Prompt
            </Button>
          )}

          {/* History list */}
          {sortedHistory.length > 0 ? (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {sortedHistory.map((item, index) => (
                <div
                  key={`${item.prompt}-${item.timestamp}`}
                  className={cn(
                    "flex items-start gap-2 p-2 rounded-md border text-sm",
                    item.isFavorite ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20" : "bg-muted/50"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleFavorite(history.indexOf(item))}
                    className={cn(
                      "shrink-0 mt-0.5",
                      item.isFavorite ? "text-yellow-500" : "text-muted-foreground hover:text-yellow-500"
                    )}
                  >
                    <Star className={cn("h-3.5 w-3.5", item.isFavorite && "fill-current")} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectPrompt(item.prompt)}
                    disabled={disabled}
                    className="flex-1 text-left text-xs line-clamp-2 hover:text-primary"
                  >
                    {item.prompt}
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePrompt(history.indexOf(item))}
                    className="shrink-0 text-muted-foreground hover:text-destructive mt-0.5"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-2">
              No saved prompts yet. Save prompts to reuse them later.
            </p>
          )}

          {/* Clear history button */}
          {history.length > favoriteCount && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearHistory}
              className="w-full text-xs text-muted-foreground"
            >
              Clear unstarred history
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
