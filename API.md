## be-ingco REST API — Quick Reference

Base URL: `/api`

### Auth

- Use header: `Authorization: Bearer <JWT>`
- Admin endpoints additionally require user role `admin`
- Content-Type: `application/json` unless specified; file upload uses `multipart/form-data`

### Static files

- `GET /static/*` — public file serving

---

## Routes

### Users — `/api/users`

- `GET /` — Admin — list users
- `GET /stats` — Admin — aggregated stats
- `GET /refresh` — Auth — refresh current user by token
- `GET /cart` — Auth — get B2B cart
- `GET /cart/retail` — Auth — get retail cart
- `GET /support` — Admin — list support tickets
- `POST /` — Admin — create user (body: userSchema)
- `POST /support` — Public — create support ticket (body: supportSchema)
- `POST /register` — Public — B2B registration (body: registerUserSchema)
- `POST /register/client` — Public — retail/client registration (body: registerUserClientSchema)
- `POST /login` — Public — sign in (body: loginSchema)
- `POST /forgot` — Public — request password reset (body: forgotSchema)
- `POST /resetPassword` — Public — set new password (body: resetPasswordSchema)
- `POST /cart` — Auth — add product to B2B cart
- `POST /cart/retail` — Auth — add product to retail cart
- `POST /favorites/:productId` — Auth — add product to favorites
- `POST /restore/:id` — Admin — restore soft-deleted user
- `PUT /:id` — Admin — update user (body: updateUserSchema)
- `PATCH /support/:ticketId` — Admin — update support ticket
- `DELETE /logout` — Auth — sign out (invalidate token)
- `DELETE /cart` — Auth — remove from B2B cart
- `DELETE /cart/retail` — Auth — remove from retail cart
- `DELETE /favorites/:productId` — Auth — remove favorite
- `DELETE /:id` — Admin — delete user

### Products — `/api/products`

- `GET /` — Public — list products (supports query params in controller; not validated here)
- `GET /sheets` — Auth — export products sheet
- `GET /ids` — Public — list of product IDs
- `GET /:slug` — Public — get product by slug
- `POST /` — Admin — create product
  - Content-Type: `multipart/form-data`
  - File field: `image`
  - Body: productSchema
- `PUT /:id` — Admin — update product
  - Content-Type: `multipart/form-data`
  - File field: `image`
  - Body: updateProductSchema
- `DELETE /:id` — Admin — delete product

### Categories — `/api/categories`

- `GET /` — Public — list categories
- `POST /` — Admin — create category (body: categorySchema)
- `PUT /:id` — Admin — update category (body: categorySchema)
- `DELETE /:id` — Admin — delete category

### Orders — `/api/orders`

- `GET /` — Auth — list current user orders
- `GET /all` — Admin — list all orders
- `GET /sheets/:id` — Admin — export order sheet by order id
- `POST /` — Auth — create order (body: createOrderSchema)
- `POST /retail` — Public — create retail order (body: createOrderRetailSchema)
- `PUT /retail/:id` — Admin — update retail order (body: updateOrderSchema)
- `PUT /:id` — Admin — update order (body: updateOrderSchema)

### Stats — `/api/stats`

- `GET /users/activity` — Admin — user activity stats
- `GET /products/clicks` — Admin — product clicks stats
- `GET /products/:productId` — Public — track product click for `productId`

### Utils — `/api/utils`

- `GET /currency` — Public — current currency rates/value

---

## Request Schemas (Joi)

Note: numeric fields accept JSON numbers; optional fields may be omitted.

### productSchema (create)

- name (string, required)
- article (string, required)
- description (string, optional, allow empty/null)
- enterPrice (number, optional, allow empty/null)
- price (number, required)
- priceRetailRecommendation (number, required)
- rrcSale (number, optional, default 0)
- warranty (number, optional)
- seoKeywords (string, optional, allow empty/null)
- countInStock (number, required)
- category (string, optional)
- sort (number, optional)
- barcode (string, optional, allow empty)
- characteristics (array of { name: string, value: string })

### updateProductSchema

- Same as productSchema but all fields optional; `category` allows null; includes `rrcSale`, `enterPrice`, `priceRetailRecommendation`, `sort`, `barcode`, `characteristics`

### categorySchema

- name (string, required)
- renderSort (number, required)

### userSchema (Admin create)

- email (string, email, required)
- login (string, required)
- password (string, required)
- role (string, one of: user, admin; default user)
- isVerified (boolean, default false)
- isB2B (boolean, default true)
- firstName (string, required)
- lastName (string, required)
- surName (string, required)
- phone (string, required)
- edrpou (string, optional, allow empty/null)
- about (string, optional, allow empty/null)
- address (string, optional, allow empty/null)
- orders (array of string)
- cart (array of string)
- cartRetail (array of string)
- favorites (array of string)
- token (string, default null)

### registerUserSchema (B2B)

- email (string, email, required)
- isVerified (boolean, default false)
- firstName, lastName, surName (string, required)
- phone (string, required)
- edrpou (string, required)
- about (string, optional, allow empty/null)

### registerUserClientSchema (Retail)

- email (string, email, required)
- firstName, lastName, surName (string, required)
- phone (string, required)
- password (string, required)

### updateUserSchema (Admin update)

- All user fields optional; also supports: `_id` (string), `deleted` (boolean)

### loginSchema

- login (string, required)
- password (string, required)

### createOrderSchema

- products (array, required) of objects:
  - productId (string, required)
  - quantity (number, required)
  - totalPriceByOneProduct (number, required)
  - price (number, required)
- shippingAddress (string, optional, allow empty)
- totalPrice (number, required)
- comment (string, optional, allow empty)

### createOrderRetailSchema

- products (array) — same structure as createOrderSchema
- shippingAddress (string, optional, allow empty)
- totalPrice (number, required)
- comment (string, optional, allow empty)
- email (string, email, required)
- firstName, lastName, surName (string, required)
- phone (string, required)
- token (string, optional, allow empty)

### updateOrderSchema

- status (string, one of Order.status enum)
- isPaid (boolean)
- declarationNumber (string, allow empty)
- products (array, optional) of objects:
  - product (string, required)
  - \_id (string, required)
  - quantity (number, required)
  - totalPriceByOneProduct (number, required)
  - price (number, required)
- totalPrice (number, optional)
- \_id (string, optional)
- comment (string, optional, allow empty)
- shippingAddress (string, optional, allow empty)

### forgotSchema

- resetData (string, required)

### resetPasswordSchema

- resetToken (string, required)
- newPassword (string, required)

### supportSchema

- name (string, 2..60, required)
- phone (string, 8..20, required)
- email (string, email, required)
- message (string, 10..500, required)

---

## Headers & Examples

- Auth header: `Authorization: Bearer <JWT>`
- JSON: `Content-Type: application/json`
- File upload (products): `multipart/form-data` with `image` file field
