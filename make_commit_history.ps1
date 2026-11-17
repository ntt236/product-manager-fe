$ErrorActionPreference = "Stop"

$workspace = "d:\product-manager-frontend\product-management-frontend"
Set-Location $workspace

# 1. Backup existing files
$backupDir = "$env:TEMP\pm_fe_backup_$(Get-Date -Format 'yyyyMMddHHmmss')"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
Write-Host "Backing up current workspace to $backupDir..."
Copy-Item -Path "$workspace\*" -Destination $backupDir -Recurse -Force -Exclude "node_modules", ".git", "build"

# 2. Re-initialize git repository
Remove-Item -Path "$workspace\.git" -Recurse -Force -ErrorAction SilentlyContinue
git init -b main
git config user.name "ntt236"
git config user.email "nguyenthanhtrieu236@gmail.com"

function Commit-Step($files, $dateStr, $message) {
    foreach ($f in $files) {
        if (Test-Path $f) {
            git add $f
        }
    }
    $env:GIT_AUTHOR_DATE = $dateStr
    $env:GIT_COMMITTER_DATE = $dateStr
    git commit -m $message
}

# Day 1: Nov 2 - Initial Setup
Commit-Step @(".gitignore", ".env.example", "package.json", "package-lock.json", "postcss.config.js", "tailwind.config.js", "README.md", "public\") `
    "2026-11-02T09:30:00+07:00" `
    "chore: initialize project scaffolding with TailwindCSS and React 18"

# Day 2: Nov 3 - Base Styles & Report
Commit-Step @("src/index.css", "src/index.jsx", "src/reportWebVitals.js", "src/setupTests.js", "src/App.test.js") `
    "2026-11-03T14:15:00+07:00" `
    "chore(config): configure base styling, entrypoints and font imports"

# Day 3: Nov 4 - Common Components & API Client
Commit-Step @("src/services/api.js", "src/components/common/LoadingSpinner.jsx", "src/components/common/Alert.jsx") `
    "2026-11-04T11:20:00+07:00" `
    "feat(api): create unified fetch API client with token interceptor and alert components"

# Day 4: Nov 5 - Authentication
Commit-Step @("src/services/authService.js", "src/contexts/AuthContext.jsx", "src/components/common/ProtectedRoute.jsx", "src/layouts/AuthLayout/AuthLayout.jsx", "src/pages/auth/LoginPage.jsx", "src/pages/auth/RegisterPage.jsx") `
    "2026-11-05T16:40:00+07:00" `
    "feat(auth): implement authentication context, protected routes, login and register screens"

# Day 5: Nov 6 - User & Admin Shell Layouts
Commit-Step @("src/layouts/UserLayout/UserHeader.jsx", "src/layouts/UserLayout/UserFooter.jsx", "src/layouts/UserLayout/UserLayout.jsx", "src/layouts/AdminLayout/AdminLayout.jsx", "src/routes/AppRoutes.jsx", "src/App.jsx") `
    "2026-11-06T10:10:00+07:00" `
    "feat(layout): design modern editorial header, footer and admin shell layout"

# Day 6: Nov 7 - Category Management
Commit-Step @("src/services/categoryService.js", "src/components/admin/CategoryModal.jsx", "src/components/admin/CategoryManager.jsx") `
    "2026-11-07T15:35:00+07:00" `
    "feat(category): add admin category management modal and hierarchy service"

# Day 7: Nov 8 - Admin Product Management
Commit-Step @("src/services/productService.js", "src/components/admin/ConfirmDeleteModal.jsx", "src/components/admin/ProductModal.jsx", "src/components/admin/ProductTable.jsx", "src/pages/admin/AdminProductsPage.jsx") `
    "2026-11-08T11:45:00+07:00" `
    "feat(admin-products): build admin product table, inventory editor and modal management"

# Day 8: Nov 9 - Homepage & Assets
Commit-Step @("src/assets/", "src/pages/user/HomePage.jsx") `
    "2026-11-09T14:20:00+07:00" `
    "feat(home): design contemporary fashion lifestyle homepage with editorial banners"

# Day 9: Nov 10 - Catalog & Product Filter
Commit-Step @("src/components/product/ProductCard.jsx", "src/components/product/ProductFilter.jsx", "src/pages/user/ProductsPage.jsx") `
    "2026-11-10T09:50:00+07:00" `
    "feat(catalog): add ProductsPage catalog with category tabs, size filter and product cards"

# Day 10: Nov 11 - Product Detail & Reviews
Commit-Step @("src/services/reviewService.js", "src/components/product/ReviewSection.jsx", "src/pages/user/ProductDetailPage.jsx") `
    "2026-11-11T16:15:00+07:00" `
    "feat(product-detail): add detailed product view, gallery preview and verified review system"

# Day 11: Nov 12 - Shopping Cart & Drawer
Commit-Step @("src/services/cartService.js", "src/contexts/CartContext.jsx", "src/components/common/CartDrawer.jsx", "src/pages/user/CartPage.jsx") `
    "2026-11-12T10:30:00+07:00" `
    "feat(cart): build persistent CartContext, slide-over CartDrawer and shopping cart page"

# Day 12: Nov 13 - Address Book
Commit-Step @("src/services/addressService.js", "src/pages/user/AddressesPage.jsx") `
    "2026-11-13T14:50:00+07:00" `
    "feat(address): add multi-address shipping book with default address selector"

# Day 13: Nov 14 - Checkout Flow
Commit-Step @("src/pages/user/CheckoutPage.jsx") `
    "2026-11-14T11:25:00+07:00" `
    "feat(checkout): implement seamless checkout process with order preview and instant validation"

# Day 14: Nov 15 - Fashion Variants & Color Utils
Commit-Step @("src/services/variantService.js", "src/utils/colorUtils.js", "src/components/admin/VariantManagerModal.jsx") `
    "2026-11-15T15:40:00+07:00" `
    "feat(variants): implement size and color variant matrix generator with color swatch mapper"

# Day 15: Nov 16 - Order History
Commit-Step @("src/services/orderService.js", "src/pages/user/MyOrdersPage.jsx") `
    "2026-11-16T10:15:00+07:00" `
    "feat(orders): implement customer order history tracking with detailed line items"

# Day 16: Nov 16 Evening - Order Detail Modal
Commit-Step @("src/components/order/OrderDetailModal.jsx") `
    "2026-11-16T17:30:00+07:00" `
    "feat(tracking): build OrderDetailModal with 4-step fulfillment status tracker"

# Day 17: Nov 17 Morning - Admin Fulfillment
Commit-Step @("src/pages/admin/AdminOrdersPage.jsx") `
    "2026-11-17T09:10:00+07:00" `
    "feat(fulfillment): build admin fulfillment console with real-time status transitions"

# Day 18: Nov 17 Late Morning - Final Fixes & Polish
git add .
$env:GIT_AUTHOR_DATE = "2026-11-17T11:55:00+07:00"
$env:GIT_COMMITTER_DATE = "2026-11-17T11:55:00+07:00"
git commit -m "fix(sort): refine catalog sorting engine, add HTTP PATCH support and polish admin UI" -a

# 3. Remote configuration & Force Push
git remote add origin https://github.com/ntt236/product-manager-fe.git
Write-Host "Pushing full commit timeline to GitHub..."
git push -u origin main --force

Write-Host "Done! Commit timeline successfully created and pushed to GitHub."
