#!/bin/bash

# OpenZKTool - Terminal Screen Recording Script for YouTube
# Generates high-quality MP4 video of the demo

set -e

OUTPUT_FILE="openzktool_demo_$(date +%Y%m%d_%H%M%S).mp4"

echo "=========================================="
echo "Terminal Recording for YouTube"
echo "=========================================="
echo ""
echo "This script will record your terminal session."
echo ""
echo "Output file: $OUTPUT_FILE"
echo "Resolution: 1920x1080"
echo "Framerate: 30fps"
echo "Quality: High (CRF 18)"
echo ""

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "ERROR: ffmpeg is not installed"
    echo ""
    echo "Install with: brew install ffmpeg"
    exit 1
fi

echo "Recording will start in 5 seconds..."
echo "Switch to your terminal window and get ready!"
echo ""
echo "Press 'q' in THIS window to stop recording when done."
echo ""

for i in {5..1}; do
    echo "  $i..."
    sleep 1
done

echo ""
echo "🔴 RECORDING STARTED"
echo ""

# Record with ffmpeg
# -f avfoundation: Use macOS screen capture
# -framerate 30: 30 fps for smooth video
# -i "1:none": Capture display 1, no audio
# -c:v libx264: H.264 codec for YouTube
# -preset medium: Balance between speed and quality
# -crf 18: High quality (lower = better, 18 is visually lossless)
# -pix_fmt yuv420p: YouTube compatible pixel format

ffmpeg \
    -f avfoundation \
    -framerate 30 \
    -i "1:none" \
    -c:v libx264 \
    -preset medium \
    -crf 18 \
    -pix_fmt yuv420p \
    -y \
    "$OUTPUT_FILE"

echo ""
echo "✅ Recording saved to: $OUTPUT_FILE"
echo ""
echo "Video specs:"
ffprobe -v error -show_entries format=duration,size,bit_rate -show_entries stream=width,height,codec_name,r_frame_rate -of default=noprint_wrappers=1 "$OUTPUT_FILE" 2>&1 | grep -E "(width|height|duration|codec_name|r_frame_rate|size)"
echo ""
echo "Ready to upload to YouTube!"
