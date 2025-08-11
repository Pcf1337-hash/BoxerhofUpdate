#!/bin/bash

# Boxerhof Website Testing and Issues Documentation Script
# Tests all implemented features and documents issues found

echo "🧪 Starting comprehensive testing of Boxerhof website..."
echo "============================================================"

# Initialize variables
ISSUES_FOUND=()
FEATURES_TESTED=()
PERFORMANCE_METRICS=()

# Test build process
echo "📦 Testing build process..."
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    echo "   ✅ Build process successful"
    FEATURES_TESTED+=("Build Process")
else
    echo "   ❌ Build process failed"
    ISSUES_FOUND+=("Build process: dist directory not created properly")
fi

# Test file structure
echo "📁 Testing file structure..."
REQUIRED_FILES=(
    "index.html"
    "admin.html" 
    "style.css"
    "admin-style.css"
    "enhancements.css"
    "modern-design.css"
    "script.js"
    "admin.js"
    "performance-enhancements.js"
    "image-optimization.js"
    "animal-filter-system.js"
    "pwa-enhancement.js"
    "manifest.json"
    "sw.js"
    "README.md"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file exists"
    else
        echo "   ❌ $file missing"
        ISSUES_FOUND+=("Missing file: $file")
    fi
done

# Test HTML validity (basic checks)
echo "📄 Testing HTML validity..."
if grep -q "<!DOCTYPE html>" index.html; then
    echo "   ✅ HTML5 DOCTYPE present"
    FEATURES_TESTED+=("HTML5 DOCTYPE")
else
    echo "   ❌ HTML5 DOCTYPE missing"
    ISSUES_FOUND+=("HTML validity: Missing DOCTYPE")
fi

if grep -q 'lang="de"' index.html; then
    echo "   ✅ Language attribute set"
    FEATURES_TESTED+=("Language Attribute")
else
    echo "   ❌ Language attribute missing"
    ISSUES_FOUND+=("HTML validity: Missing language attribute")
fi

# Test CSS validity (basic checks)
echo "🎨 Testing CSS structure..."
if grep -q ":root" style.css; then
    echo "   ✅ CSS custom properties (CSS variables) used"
    FEATURES_TESTED+=("CSS Custom Properties")
else
    echo "   ❌ CSS custom properties not found"
    ISSUES_FOUND+=("CSS: No CSS custom properties found")
fi

# Test JavaScript syntax (basic checks)
echo "📜 Testing JavaScript structure..."
JS_FILES=("script.js" "admin.js" "image-optimization.js" "animal-filter-system.js" "pwa-enhancement.js")

for js_file in "${JS_FILES[@]}"; do
    if [ -f "$js_file" ]; then
        # Check for basic JavaScript structure
        if grep -q "function\|class\|const\|let" "$js_file"; then
            echo "   ✅ $js_file has valid JavaScript structure"
        else
            echo "   ❌ $js_file may have syntax issues"
            ISSUES_FOUND+=("JavaScript: $js_file may have syntax issues")
        fi
        
        # Check for console.log statements (should be minimal in production)
        console_logs=$(grep -c "console\.log" "$js_file")
        if [ "$console_logs" -gt 10 ]; then
            echo "   ⚠️  $js_file has many console.log statements ($console_logs)"
            ISSUES_FOUND+=("Code quality: $js_file has $console_logs console.log statements")
        fi
    fi
done

# Test PWA features
echo "📱 Testing PWA features..."
if [ -f "manifest.json" ] && [ -f "sw.js" ]; then
    echo "   ✅ PWA manifest and service worker files present"
    FEATURES_TESTED+=("PWA Basic Files")
    
    # Check manifest structure
    if grep -q '"name":\|"short_name":\|"start_url":\|"display":' manifest.json; then
        echo "   ✅ Manifest has required fields"
        FEATURES_TESTED+=("PWA Manifest Structure")
    else
        echo "   ❌ Manifest missing required fields"
        ISSUES_FOUND+=("PWA: Manifest missing required fields")
    fi
    
    # Check service worker structure
    if grep -q "addEventListener\|install\|fetch" sw.js; then
        echo "   ✅ Service worker has event listeners"
        FEATURES_TESTED+=("Service Worker Structure")
    else
        echo "   ❌ Service worker missing event listeners"
        ISSUES_FOUND+=("PWA: Service worker missing event listeners")
    fi
else
    echo "   ❌ PWA files missing"
    ISSUES_FOUND+=("PWA: Manifest or service worker files missing")
fi

# Test modern design features
echo "🎨 Testing modern design implementation..."
if [ -f "modern-design.css" ]; then
    if grep -q "gradient\|transform\|animation" modern-design.css; then
        echo "   ✅ Modern CSS features implemented"
        FEATURES_TESTED+=("Modern CSS Features")
    else
        echo "   ❌ Modern CSS features not found"
        ISSUES_FOUND+=("Design: Modern CSS features not implemented")
    fi
    
    if grep -q "@media.*prefers-color-scheme" modern-design.css; then
        echo "   ✅ Dark mode support implemented"
        FEATURES_TESTED+=("Dark Mode Support")
    else
        echo "   ❌ Dark mode support missing"
        ISSUES_FOUND+=("Design: Dark mode support not implemented")
    fi
else
    echo "   ❌ Modern design CSS file missing"
    ISSUES_FOUND+=("Design: modern-design.css file missing")
fi

# Test filter system
echo "🔍 Testing filter system..."
if [ -f "animal-filter-system.js" ]; then
    if grep -q "class.*Filter\|filter.*function" animal-filter-system.js; then
        echo "   ✅ Filter system class structure found"
        FEATURES_TESTED+=("Filter System Structure")
    else
        echo "   ❌ Filter system structure not found"
        ISSUES_FOUND+=("Functionality: Filter system structure missing")
    fi
    
    if grep -q "localStorage\|savedFilters" animal-filter-system.js; then
        echo "   ✅ Saved filters functionality implemented"
        FEATURES_TESTED+=("Saved Filters")
    else
        echo "   ❌ Saved filters functionality missing"
        ISSUES_FOUND+=("Functionality: Saved filters not implemented")
    fi
else
    echo "   ❌ Filter system file missing"
    ISSUES_FOUND+=("Functionality: animal-filter-system.js missing")
fi

# Test image optimization
echo "🖼️ Testing image optimization..."
if [ -f "image-optimization.js" ]; then
    if grep -q "ImageOptimizer\|canvas\|WebP" image-optimization.js; then
        echo "   ✅ Image optimization features implemented"
        FEATURES_TESTED+=("Image Optimization")
    else
        echo "   ❌ Image optimization features not found"
        ISSUES_FOUND+=("Performance: Image optimization not implemented")
    fi
    
    if grep -q "lazy.*loading\|IntersectionObserver" image-optimization.js; then
        echo "   ✅ Lazy loading implemented"
        FEATURES_TESTED+=("Lazy Loading")
    else
        echo "   ❌ Lazy loading not found"
        ISSUES_FOUND+=("Performance: Lazy loading not implemented")
    fi
else
    echo "   ❌ Image optimization file missing"
    ISSUES_FOUND+=("Performance: image-optimization.js missing")
fi

# Test accessibility features
echo "♿ Testing accessibility features..."
if grep -q 'aria-label\|aria-describedby\|role=' index.html; then
    echo "   ✅ ARIA attributes found in HTML"
    FEATURES_TESTED+=("ARIA Attributes")
else
    echo "   ❌ ARIA attributes missing"
    ISSUES_FOUND+=("Accessibility: ARIA attributes not found")
fi

if grep -q 'alt=' index.html; then
    echo "   ✅ Alt text attributes found"
    FEATURES_TESTED+=("Alt Text")
else
    echo "   ❌ Alt text attributes missing"
    ISSUES_FOUND+=("Accessibility: Alt text attributes missing")
fi

# Test performance features
echo "⚡ Testing performance optimizations..."
if grep -q 'preload\|prefetch' index.html; then
    echo "   ✅ Resource hints (preload/prefetch) implemented"
    FEATURES_TESTED+=("Resource Hints")
else
    echo "   ❌ Resource hints missing"
    ISSUES_FOUND+=("Performance: Resource hints not implemented")
fi

# Calculate file sizes
echo "📊 Analyzing file sizes..."
TOTAL_SIZE=0
LARGE_FILES=()

for file in *.css *.js; do
    if [ -f "$file" ]; then
        size=$(wc -c < "$file")
        TOTAL_SIZE=$((TOTAL_SIZE + size))
        
        # Flag files larger than 50KB as potentially large
        if [ "$size" -gt 51200 ]; then
            LARGE_FILES+=("$file (${size} bytes)")
        fi
    fi
done

echo "   📊 Total uncompressed size: $TOTAL_SIZE bytes"
PERFORMANCE_METRICS+=("Total size: $TOTAL_SIZE bytes")

if [ ${#LARGE_FILES[@]} -gt 0 ]; then
    echo "   ⚠️  Large files detected:"
    for large_file in "${LARGE_FILES[@]}"; do
        echo "      - $large_file"
    done
    ISSUES_FOUND+=("Performance: Large files detected - consider code splitting")
fi

# Check for SEO basics
echo "🔍 Testing SEO implementation..."
if grep -q '<meta name="description"' index.html; then
    echo "   ✅ Meta description found"
    FEATURES_TESTED+=("Meta Description")
else
    echo "   ❌ Meta description missing"
    ISSUES_FOUND+=("SEO: Meta description missing")
fi

if grep -q '<title>' index.html; then
    echo "   ✅ Title tag found"
    FEATURES_TESTED+=("Title Tag")
else
    echo "   ❌ Title tag missing"
    ISSUES_FOUND+=("SEO: Title tag missing")
fi

# Test admin panel features
echo "🔧 Testing admin panel..."
if [ -f "admin.html" ] && [ -f "admin.js" ]; then
    echo "   ✅ Admin panel files present"
    FEATURES_TESTED+=("Admin Panel Files")
    
    if grep -q "login\|authentication" admin.js; then
        echo "   ✅ Authentication system found"
        FEATURES_TESTED+=("Admin Authentication")
    else
        echo "   ❌ Authentication system not found"
        ISSUES_FOUND+=("Security: Admin authentication system missing")
    fi
else
    echo "   ❌ Admin panel files missing"
    ISSUES_FOUND+=("Functionality: Admin panel files missing")
fi

# Test responsive design
echo "📱 Testing responsive design..."
if grep -q '@media.*max-width\|@media.*min-width' style.css modern-design.css 2>/dev/null; then
    echo "   ✅ Media queries found"
    FEATURES_TESTED+=("Responsive Design")
else
    echo "   ❌ Media queries not found"
    ISSUES_FOUND+=("Design: Responsive design media queries missing")
fi

# Check for modern JavaScript features
echo "📜 Testing modern JavaScript features..."
JS_MODERN_FEATURES=("async\|await" "const\|let" "=>" "class")
MODERN_JS_FOUND=0

for feature in "${JS_MODERN_FEATURES[@]}"; do
    if grep -q "$feature" script.js admin.js 2>/dev/null; then
        MODERN_JS_FOUND=$((MODERN_JS_FOUND + 1))
    fi
done

if [ "$MODERN_JS_FOUND" -ge 3 ]; then
    echo "   ✅ Modern JavaScript features used"
    FEATURES_TESTED+=("Modern JavaScript")
else
    echo "   ❌ Limited modern JavaScript features"
    ISSUES_FOUND+=("Code quality: Limited use of modern JavaScript features")
fi

# Generate summary report
echo ""
echo "============================================================"
echo "📋 TESTING SUMMARY REPORT"
echo "============================================================"

echo ""
echo "✅ FEATURES SUCCESSFULLY TESTED (${#FEATURES_TESTED[@]} features):"
for feature in "${FEATURES_TESTED[@]}"; do
    echo "   ✓ $feature"
done

echo ""
if [ ${#ISSUES_FOUND[@]} -eq 0 ]; then
    echo "🎉 NO ISSUES FOUND - All tests passed!"
else
    echo "⚠️  ISSUES FOUND (${#ISSUES_FOUND[@]} issues):"
    for issue in "${ISSUES_FOUND[@]}"; do
        echo "   ❌ $issue"
    done
fi

echo ""
echo "📊 PERFORMANCE METRICS:"
for metric in "${PERFORMANCE_METRICS[@]}"; do
    echo "   📈 $metric"
done

# Generate issues for README update
if [ ${#ISSUES_FOUND[@]} -gt 0 ]; then
    echo ""
    echo "📝 ISSUES TO ADD TO README.md TODO SECTION:"
    echo "### 🚨 Gefundene Probleme bei Tests ($(date '+%Y-%m-%d')):"
    for issue in "${ISSUES_FOUND[@]}"; do
        echo "- [ ] **Fix: $issue**"
    done
fi

echo ""
echo "✅ Testing completed successfully!"
echo "📊 Test Results: ${#FEATURES_TESTED[@]} features tested, ${#ISSUES_FOUND[@]} issues found"

# Exit with appropriate code
if [ ${#ISSUES_FOUND[@]} -eq 0 ]; then
    exit 0
else
    exit 1
fi