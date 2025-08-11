#!/bin/bash

# Boxerhof Website Build Script
# Optimizes CSS and JS files for production

echo "🔧 Starting Boxerhof Website Build Process..."

# Create dist directory if it doesn't exist
mkdir -p dist

# Copy HTML files
echo "📄 Copying HTML files..."
cp index.html dist/
cp admin.html dist/
cp manifest.json dist/
cp sw.js dist/

# Minify CSS files using a simple regex approach
echo "🎨 Optimizing CSS files..."

# Function to minify CSS
minify_css() {
    local input_file="$1"
    local output_file="$2"
    
    # Remove comments, extra whitespace, and empty lines
    sed -e 's|/\*.*\*/||g' \
        -e 's/[[:space:]]*{[[:space:]]*/{ /g' \
        -e 's/[[:space:]]*}[[:space:]]*/} /g' \
        -e 's/[[:space:]]*:[[:space:]]*/: /g' \
        -e 's/[[:space:]]*;[[:space:]]*/; /g' \
        -e 's/[[:space:]]*,[[:space:]]*/, /g' \
        -e '/^[[:space:]]*$/d' \
        "$input_file" | tr -d '\n' | sed 's/; }/}/g' > "$output_file"
    
    echo "   ✓ Minified $input_file -> $output_file"
}

# Function to minify JavaScript
minify_js() {
    local input_file="$1"
    local output_file="$2"
    
    # Remove comments and extra whitespace (basic minification)
    sed -e 's|//.*$||g' \
        -e 's|/\*.*\*/||g' \
        -e 's/^[[:space:]]*//' \
        -e 's/[[:space:]]*$//' \
        -e '/^$/d' \
        "$input_file" | tr '\n' ' ' | sed 's/[[:space:]]\+/ /g' > "$output_file"
    
    echo "   ✓ Minified $input_file -> $output_file"
}

# Minify CSS files
minify_css "style.css" "dist/style.min.css"
minify_css "admin-style.css" "dist/admin-style.min.css"
minify_css "enhancements.css" "dist/enhancements.min.css"

# Minify JavaScript files
minify_js "script.js" "dist/script.min.js"
minify_js "admin.js" "dist/admin.min.js"
minify_js "performance-enhancements.js" "dist/performance-enhancements.min.js"

# Update HTML files to use minified versions
echo "🔗 Updating HTML references to minified files..."

sed -i 's/style\.css/style.min.css/g' dist/index.html
sed -i 's/admin-style\.css/admin-style.min.css/g' dist/index.html dist/admin.html
sed -i 's/enhancements\.css/enhancements.min.css/g' dist/index.html dist/admin.html
sed -i 's/script\.js/script.min.js/g' dist/index.html dist/admin.html
sed -i 's/admin\.js/admin.min.js/g' dist/admin.html
sed -i 's/performance-enhancements\.js/performance-enhancements.min.js/g' dist/index.html dist/admin.html

# Calculate file sizes
echo "📊 Build Statistics:"
echo "Original sizes:"
for file in style.css admin-style.css enhancements.css script.js admin.js performance-enhancements.js; do
    if [ -f "$file" ]; then
        size=$(wc -c < "$file")
        echo "   $file: ${size} bytes"
    fi
done

echo "Minified sizes:"
for file in dist/*.min.css dist/*.min.js; do
    if [ -f "$file" ]; then
        size=$(wc -c < "$file")
        basename_file=$(basename "$file")
        echo "   $basename_file: ${size} bytes"
    fi
done

# Create gzipped versions for even better compression
echo "🗜️  Creating gzipped versions..."
for file in dist/*.min.css dist/*.min.js dist/*.html; do
    gzip -c "$file" > "$file.gz"
    echo "   ✓ Created $(basename "$file").gz"
done

echo "✅ Build process completed successfully!"
echo "📁 Production files available in ./dist/ directory"
echo "🚀 Deploy the contents of ./dist/ to your web server"

# Optional: Create a simple deployment guide
cat > dist/DEPLOYMENT.md << EOF
# Deployment Guide

## Files in this directory:
- \`index.html\` - Main website
- \`admin.html\` - Admin panel
- \`manifest.json\` - PWA manifest
- \`sw.js\` - Service worker
- \`*.min.css\` - Minified stylesheets
- \`*.min.js\` - Minified JavaScript files
- \`*.gz\` - Gzipped versions for better compression

## Deployment Instructions:

### 1. Static File Hosting (GitHub Pages, Netlify, Vercel)
Upload all files in this directory to your hosting service.

### 2. Traditional Web Server (Apache, Nginx)
1. Copy all files to your web root directory
2. Configure your server to serve .gz files when available:

#### Apache (.htaccess):
\`\`\`apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTP:Accept-Encoding} gzip
    RewriteCond %{REQUEST_FILENAME}.gz -s
    RewriteRule ^(.*)$ \$1.gz [L]
</IfModule>

<FilesMatch "\.gz$">
    AddType text/css .css.gz
    AddType application/javascript .js.gz
    AddEncoding gzip .gz
</FilesMatch>
\`\`\`

#### Nginx:
\`\`\`nginx
location ~* \.(css|js)$ {
    gzip_static on;
    expires 1y;
    add_header Cache-Control public;
}
\`\`\`

### 3. Performance Tips:
- Enable server-side compression
- Set appropriate cache headers
- Use a CDN for static assets
- Monitor Core Web Vitals

Enjoy your optimized Boxerhof website! 🐕
EOF

echo "📖 Deployment guide created: dist/DEPLOYMENT.md"