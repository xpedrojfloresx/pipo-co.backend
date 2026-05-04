# Pipo & Co — Backend API

REST API for the Pipo & Co pet food e-commerce platform. Built with Node.js, Express, and MongoDB Atlas.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework | Express 5 |
| Database | MongoDB Atlas via Mongoose |
| Authentication | bcrypt (password hashing) |
| Email | Nodemailer + Brevo SMTP |
| Validation | express-validator |
| Logging | Morgan |

## Project Structure

```
Back/
├── index.js                  # Entry point — loads env, connects DB, starts server
├── app.js                    # Express app — middleware, route registration
├── database/
│   └── conexionAtlas.js      # MongoDB Atlas connection
├── models/
│   ├── usersModels.js        # User schema (name, email, password, role)
│   ├── productosModels.js    # Product schema (name, image, price, description, badge)
│   └── pedidosModels.js      # Order schema (items, shipping, status)
├── controllers/
│   ├── usersController.js    # Register, login, list users
│   ├── productosController.js# CRUD for products
│   └── pedidosController.js  # Create orders, get orders, update status
├── routes/
│   ├── usersRoutes.js
│   ├── productosRoutes.js
│   └── pedidosRoutes.js
├── helps/
│   └── enviarMail.js         # Nodemailer setup, welcome & order confirmation emails
└── templates/
    ├── welcomeMail.html
    └── pedidoMail.html
```

## API Reference

### Users — `/api/usuarios`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/registro` | Register a new user |
| POST | `/login` | Login |
| GET | `/` | List all users |

### Products — `/api/productos`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List all products |
| GET | `/:id` | Get product by ID |
| POST | `/` | Create product |
| PUT | `/:id` | Update product |
| DELETE | `/:id` | Delete product |

### Orders — `/api/pedidos`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Create order |
| GET | `/` | List all orders (admin) |
| GET | `/usuario/:usuarioId` | Orders by user |
| PUT | `/:id/estado` | Update order status |

Order statuses: `pendiente` → `confirmado` → `enviado` → `entregado` / `cancelado`

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB Atlas cluster
- A Brevo account for transactional email

### Installation

```bash
git clone <repo-url>
cd Back
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=8080

# MongoDB Atlas
MONGO_USER=your_db_user
MONGO_PASSWORD=your_db_password
MONGO_CLUSTER=cluster0.xxxxxx.mongodb.net
MONGO_DB=your_database_name

# SMTP (Brevo)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=2525
SMTP_USER=your_brevo_email
SMTP_PASS=your_brevo_api_key
MAIL_FROM=your_sender_email

# CORS
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# Frontend URL (used in email links)
FRONTEND_URL=http://localhost:5173
```

### Running

```bash
npm run dev
```

Server starts on `http://localhost:8080` by default.

## Validation Rules

**Registration:**
- `nombre` — required, non-empty string
- `email` — must be a valid email address
- `password` — alphanumeric, 6–12 characters

**Order creation:**
- `items` — non-empty array
- `nombre`, `apellido`, `email`, `telefono` — all required
- `direccion` — required when delivery mode is `envio`
- `modoEntrega` — must be `envio` or `retiro`

## Email Notifications

Two transactional emails are sent automatically:

- **Welcome email** — sent on successful registration
- **Order confirmation** — sent on order creation, includes a WhatsApp link for coordination

Templates are in `/templates/` as HTML files.
