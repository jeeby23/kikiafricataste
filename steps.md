# API Contract

All responses: `{ data: T | null, error: string | null }`
Prices are in **cents/pence** (divide by 100 for display — store prices in £/€).

---

## Notes

- All product routes use singular `/product` not `/products`
- Delivery fee is calculated server-side — never send it from the frontend
- Cart lives in localStorage — nothing is saved to DB until order is placed
- Weight is always in **kg** (250g = 0.25kg)
- `PER_KG` products use `weightKg`, `FIXED` products use `quantity`
- Order expires after **30 minutes** if not confirmed by admin

---

## Public endpoints (no auth)

### Products

```
GET  /api/public/product?category=slug&search=&page=1&limit=20
GET  /api/public/product/:slug
GET  /api/public/product/:slug/related?limit=4
```

### Categories
```
GET  /api/public/category
```

### Orders

```
POST /api/public/order
```

Body:

```json
{
  "customerName": "Tola Adebayo",
  "customerEmail": "tola@example.com",
  "customerWhatsapp": "+447123456789",
  "deliveryAddress": "12 Greenford Road",
  "deliveryCity": "London",
  "deliveryState": "Greater London",
  "notes": "Call before delivery",
  "items": [
    { "productId": "clx123", "pricingType": "FIXED", "quantity": 2 },
    { "productId": "clx456", "pricingType": "PER_KG", "weightKg": 0.75 }
  ]
}
```

Returns:

```json
{
  "data": {
    "orderNumber": "ORD-0001",
    "subtotal": 1950,
    "deliveryFee": 1000,
    "total": 2950,
    "expiresAt": "2026-06-17T13:30:00.000Z"
  },
  "error": null
}
```

### Order status (for confirmation page)

```
GET  /api/public/order/:orderNumber
```

Returns:

```json
{
  "data": {
    "orderNumber": "ORD-0001",
    "status": "PENDING_PAYMENT",
    "customerName": "Tola Adebayo",
    "customerEmail": "tola@example.com",
    "deliveryAddress": "12 Greenford Road",
    "deliveryCity": "London",
    "deliveryState": "Greater London",
    "notes": null,
    "subtotal": 1950,
    "deliveryFee": 1000,
    "total": 2950,
    "expiresAt": "2026-06-17T13:30:00.000Z",
    "confirmedAt": null,
    "cancelledAt": null,
    "createdAt": "2026-06-17T13:00:00.000Z",
    "minutesRemaining": 24,
    "secondsRemaining": 13,
    "items": [
      {
        "productName": "Goat Meat",
        "imageUrl": "https://res.cloudinary.com/...",
        "pricingType": "PER_KG",
        "quantity": null,
        "weightKg": 0.75,
        "unitPrice": 1200,
        "subtotal": 900
      }
    ]
  },
  "error": null
}
```

> Poll this every 30 seconds on the confirmation page to keep countdown live
> and detect when owner confirms or cancels.

---

## Delivery fee (server-calculated, never sent from frontend)

| Total PER_KG weight | Fee    |
| ------------------- | ------ |
| 0 – 10kg            | £10.00 |
| 10.01 – 20kg        | £20.00 |
| Above 20kg          | £30.00 |

---

## Admin endpoints (requires `admin_token` httpOnly cookie)

Set by logging in via `POST /api/admin/login`.
All `/api/admin/*` routes return `401` if cookie is missing or expired.

---

### Auth

```
POST /api/admin/login
```

Body: `{ "email": "owner@email.com", "password": "yourpassword" }`
Returns: `{ data: { email }, error: null }`
Sets `admin_token` httpOnly cookie (7 day expiry).

```
POST /api/admin/logout
```

Clears the `admin_token` cookie.

```
POST /api/admin/forgot-password
```

Body: `{ "email": "owner@email.com" }`
Sends a password reset link to the email (valid 15 minutes).
Always returns same message whether email exists or not.

```
POST /api/admin/reset-password
```

Body: `{ "token": "xxx", "password": "newpassword" }`
Validates token, updates password, deletes token.

---

### Products

```
GET    /api/admin/product?search=&page=1&limit=20
POST   /api/admin/product
GET    /api/admin/product/:id
PUT    /api/admin/product/:id
DELETE /api/admin/product/:id              → soft delete (isActive: false)
DELETE /api/admin/product/:id?hard=true   → permanent delete (only if no orders)
PATCH  /api/admin/product/:id/toggle      → publish / unpublish
```

**POST / PUT body (FIXED product):**

```json
{
  "name": "Kpomo Pack",
  "description": "Pre-cut and cleaned",
  "pricingType": "FIXED",
  "price": 350,
  "stockQty": 20,
  "categoryId": "clx123",
  "isActive": true
}
```

**POST / PUT body (PER_KG product):**

```json
{
  "name": "Goat Meat",
  "description": "Fresh bone-in goat meat",
  "pricingType": "PER_KG",
  "pricePerKg": 1200,
  "stockKg": 15.5,
  "minWeightKg": 0.25,
  "stepWeightKg": 0.25,
  "categoryId": "clx123",
  "isActive": true
}
```

> `price` and `pricePerKg` are in pence/cents (£12.00 = 1200)
> `minWeightKg` — smallest order e.g. 0.25 = 250g
> `stepWeightKg` — selector increments e.g. 0.25 = jumps in 250g steps
> `categoryId` is optional

**Toggle response:**

```json
{ "data": { "isActive": true }, "error": null }
```

---

### Images

```
POST   /api/admin/product/:id/images          → upload image
PATCH  /api/admin/product/:id/images          → reorder images
DELETE /api/admin/product/:id/images/:imageId → delete one image
```

**Upload** — `multipart/form-data`:

- `image` (File) — JPEG, PNG, or WebP, max 5MB
- `altText` (string, optional)

First image uploaded is automatically set as primary.

**Reorder** body:

```json
{ "orderedIds": ["imageId1", "imageId2", "imageId3"] }
```

First ID in array becomes the primary image.

**Upload flow** (two sequential calls, one form submission):

```ts
// 1. create product
const { data: product } = await fetch("/api/admin/product", {
  method: "POST",
  body: JSON.stringify(productData),
}).then((r) => r.json());

// 2. upload each image using the product id
for (const file of selectedFiles) {
  const form = new FormData();
  form.append("image", file);
  await fetch(`/api/admin/product/${product.id}/images`, {
    method: "POST",
    body: form,
  });
}
```

---

### Categories

```
GET    /api/admin/category
POST   /api/admin/category           body: { "name": "Meat" }
PUT    /api/admin/category/:id       body: { "name": "Fresh Meat" }
DELETE /api/admin/category/:id       → fails if category has products
```

---

### Orders

```
GET   /api/admin/order?status=PENDING_PAYMENT&search=&page=1&limit=20&from=2026-06-01&to=2026-06-30
GET   /api/admin/order/:id
PATCH /api/admin/order/:id/confirm
PATCH /api/admin/order/:id/cancel
```

**Order status values:** `PENDING_PAYMENT` | `CONFIRMED` | `CANCELLED`

**Filter examples:**
```
/api/admin/order?status=PENDING_PAYMENT
/api/admin/order?from=2026-06-01&to=2026-06-30
/api/admin/order?status=CONFIRMED&from=2026-06-24
/api/admin/order?search=ORD-0012
/api/admin/order?search=Tola
```

**Confirm** — owner has verified bank transfer, marks order as confirmed.
Sends confirmation email to customer with full order items.
Cannot confirm an already cancelled order.

**Cancel** — manually cancel. Restores stock.
Cannot cancel an already confirmed order.
Sends cancellation email to customer.

---

### Cron (called by cron-job.org every minute)

```
GET /api/cron/cancel-expired-orders
Header: x-cron-secret: <CRON_SECRET>
```

Finds all `PENDING_PAYMENT` orders past their `expiresAt`, cancels them,
restores stock, and sends cancellation emails.

Returns: `{ data: { cancelled: 2 }, error: null }`

> The admin orders list also runs this automatically as a fallback
> in case cron-job.org is down.

---

## Email notifications (Resend)

| Trigger            | Recipient | Content                                           |
| ------------------ | --------- | ------------------------------------------------- |
| Order placed       | Customer  | Order items, total, bank details, 30-min deadline |
| Order placed       | Admin     | Order items, customer contact, total              |
| Admin confirms     | Customer  | Order items, total, confirmation message          |
| Auto/manual cancel | Customer  | Cancellation notice                               |
| Forgot password    | Admin     | Reset link (15 min expiry)                        |

---

## Cart (frontend only — no API)

Cart lives in `localStorage` under key `kiki_cart`.
Nothing is saved to the database until the customer submits the checkout form.

```ts
// FIXED item in cart
{
  productId: "clx456",
  name: "Kpomo Pack",
  pricingType: "FIXED",
  quantity: 2,
  weightKg: null,
  unitPrice: 350,
  subtotal: 700,
  imageUrl: "https://..."
}

// PER_KG item in cart
{
  productId: "clx123",
  name: "Goat Meat",
  pricingType: "PER_KG",
  quantity: null,
  weightKg: 0.75,
  unitPrice: 1200,
  subtotal: 900,
  imageUrl: "https://..."
}
```

Use the `useCart` hook from `hooks/useCart.ts` — handles add, remove, update, clear, total, count.

**Weight selector for PER_KG products:**

- Starts at `minWeightKg` (e.g. 0.25 = 250g)
- Increments by `stepWeightKg` (e.g. 0.25 = 250g steps)
- Price recalculates live: `price = (weightKg * pricePerKg) / 100`
- Send `weightKg` to API (not grams)

---

## Git workflow

```bash
# Always branch off main
git checkout main
git pull

# Create a feature branch
git switch -c feature/storefront-home

# Work and commit
git add .
git commit -m "Add product listing page"

# Push to remote
git push -u origin feature/storefront-home

# Open PR into dev branch for review
# Never push directly to main
```

| Task                 | Command                     |
| -------------------- | --------------------------- |
| View local branches  | `git branch`                |
| View remote branches | `git branch -r`             |
| Current branch       | `git branch --show-current` |
| Switch branch        | `git switch branch-name`    |
| Update branch list   | `git fetch --all`           |
