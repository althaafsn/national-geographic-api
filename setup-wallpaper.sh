#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SYSTEMD_USER_DIR="$HOME/.config/systemd/user"

echo "==> Setting up NatGeo wallpaper automation..."

# Ensure the project path in the service file matches reality
SERVICE_SRC="$SCRIPT_DIR/systemd/natgeo-wallpaper.service"
TIMER_SRC="$SCRIPT_DIR/systemd/natgeo-wallpaper.timer"

# Replace %h placeholder with actual home in a temp copy if needed
# (systemd expands %h natively, so this is just a sanity note)

mkdir -p "$SYSTEMD_USER_DIR"

# Patch the WorkingDirectory to the actual project path
sed "s|%h/national-geographic-api|$SCRIPT_DIR|g" "$SERVICE_SRC" \
  > "$SYSTEMD_USER_DIR/natgeo-wallpaper.service"

cp "$TIMER_SRC" "$SYSTEMD_USER_DIR/natgeo-wallpaper.timer"

echo "==> Installed service and timer to $SYSTEMD_USER_DIR"

# Reload systemd user daemon and enable the timer
systemctl --user daemon-reload
systemctl --user enable --now natgeo-wallpaper.timer

echo ""
echo "==> Done! The wallpaper will update daily at 08:00."
echo "    To update right now, run:"
echo "      npm run wallpaper"
echo "    Or trigger the service manually:"
echo "      systemctl --user start natgeo-wallpaper.service"
echo "    To check the timer:"
echo "      systemctl --user list-timers natgeo-wallpaper.timer"
