# API Contract

All responses: `{ data: T | null, error: string | null }`
Prices are in **kobo** (divide by 100 for naira display).

---

## Public endpoints (no auth)

### Products

GET /api/products?category=slug&search=&page=1&limit=20
GET /api/products/:slug

### Categories

GET /api/categories

### Orders

POST /api/orders
Body: {
customerName, customerEmail?, customerWhatsapp,
deliveryAddress, deliveryCity, deliveryState, notes?,
deliveryFee,
items: [{ productId, quantity }]
}
Returns: { orderNumber, total, expiresAt }

---

## Admin endpoints (requires admin_token cookie)

### Auth

POST /api/admin/login { email, password }
POST /api/admin/logout

### Products

GET /api/admin/products?search=&page=1&limit=20
POST /api/admin/products
GET /api/admin/products/:id
PUT /api/admin/products/:id
DELETE /api/admin/products/:id (soft delete)
PATCH /api/admin/products/:id/toggle (publish/unpublish)

### Images

POST /api/admin/products/:id/images (multipart/form-data: image, altText?)
PATCH /api/admin/products/:id/images { orderedIds: string[] }
DELETE /api/admin/products/:id/images/:imageId

### Categories

GET /api/admin/categories
POST /api/admin/categories { name }
PUT /api/admin/categories/:id { name }
DELETE /api/admin/categories/:id

### Orders

GET /api/admin/orders?status=PENDING_PAYMENT&search=&page=1
GET /api/admin/orders/:id
PATCH /api/admin/orders/:id/confirm
PATCH /api/admin/orders/:id/cancel

### Dashboard

GET /api/admin/dashboard
Returns: { pendingCount, todayOrders, todayRevenue, recentOrders, lowStockProducts }

Task Command
View local branches git branch
View remote branches git branch -r
View all branches git branch -a
Current branch git branch --show-current
Detailed info git branch -vv
Update branch list git fetch --all

Typical workflow

# Make sure you're on the latest main branch

git checkout main
git pull

# Create a feature branch

git switch -c feature/payment

# Work and commit changes

git add .
git commit -m "Add payment feature"

# Push it to remote

git push -u origin feature/payment
