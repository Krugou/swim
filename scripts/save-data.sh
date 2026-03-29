#!/bin/bash
set -e

# ─── Configuration ───────────────────────────────────────────────────────────
USER_NAME="Swim Data Bot"
USER_EMAIL="bot@swim-halls.app"
COMMIT_MESSAGE="chore: collect swimming hall data [skip ci]"
HISTORY_DIR="public/data/history/"
SUMMARY_DIR="public/data/summary/"
INDEX_FILE="public/data/history_index.json"

echo "🏊 Setting up git configuration..."
git config --global user.name "$USER_NAME"
git config --global user.email "$USER_EMAIL"

echo "📦 Adding data files to staging..."
# Check if any data files exist to commit
HAS_FILES=false

if [ -d "$HISTORY_DIR" ]; then
    git add "$HISTORY_DIR"
    HAS_FILES=true
fi

if [ -d "$SUMMARY_DIR" ]; then
    git add "$SUMMARY_DIR"
    HAS_FILES=true
fi

if [ -f "$INDEX_FILE" ]; then
    git add "$INDEX_FILE"
    HAS_FILES=true
fi

if [ "$HAS_FILES" = false ]; then
    echo "📭 No data files found to add."
    exit 0
fi

echo "🔍 Checking for changes..."
if git diff --staged --quiet; then
    echo "📭 No changes to commit."
    exit 0
else
    echo "📝 Changes detected. Committing..."
    git commit -m "$COMMIT_MESSAGE" --no-verify

    echo "⬇️  Pulling latest changes (rebase)..."
    git pull --rebase --autostash

    echo "⬆️  Pushing changes..."
    git push
    echo "✅ Successfully pushed data changes."

    if [ -n "$GITHUB_STEP_SUMMARY" ]; then
        echo "## 🏊 Swim Data Collected" >> "$GITHUB_STEP_SUMMARY"
        echo "Successfully collected and saved swimming hall reservation data." >> "$GITHUB_STEP_SUMMARY"
        echo "- **Status**: Saved & Pushed" >> "$GITHUB_STEP_SUMMARY"
        echo "- **Time**: $(date)" >> "$GITHUB_STEP_SUMMARY"
    fi
fi
