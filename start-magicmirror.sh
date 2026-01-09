#!/bin/bash
# Start MagicMirror script with touch keyboard support

# Start Onboard in the background if not already running
if ! pgrep -x "onboard" > /dev/null; then
    echo "Starting Onboard virtual keyboard..."
    onboard &
    sleep 2
fi

# Load NVM
export NVM_DIR="$HOME/.config/nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Change to MagicMirror directory
cd /home/urkif/MagicMirror || exit 1

# Check if PM2 is installed
if command -v pm2 &> /dev/null; then
    echo "Starting MagicMirror with PM2..."
    pm2 start npm --name "mm" -- start
    echo "MagicMirror started with PM2!"
    echo "Use 'pm2 logs mm' to view logs"
    sleep 3
else
    echo "Starting MagicMirror with npm..."
    npm start
fi