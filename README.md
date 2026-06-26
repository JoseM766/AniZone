# 🎌 AniZone — E-commerce de Anime & Manga

API REST + Vistas con Node.js, Express, MongoDB y WebSockets.

---

## 🚀 Instalación

```bash
# 1. Clonar el repositorio
git clone <tu-repo>
cd anizone

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tu MongoDB URI

# 4. Correr en desarrollo
npm run dev

# 5. Abrir en el navegador
# http://localhost:8080
```

---

## ⚙️ Variables de entorno (.env)

```
PORT=8080
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster0.xxxxx.mongodb.net/ecommerce
```

### MongoDB Atlas (gratis):
1. Registrarse en https://www.mongodb.com/cloud/atlas
2. Crear un cluster gratuito (M0)
3. En "Database Access": crear usuario y contraseña
4. En "Network Access": agregar tu IP (o 0.0.0.0/0 para todas)
5. En "Connect" → "Connect your application" → copiar la URI

### MongoDB Local:
```
MONGO_URI=mongodb://localhost:27017/ecommerce
```

---

## 📁 Estructura del proyecto

```
anizone/
├── src/
│   ├── app.js                    # Entrada principal
│   ├── dao/
│   │   ├── mongo/
│   │   │   ├── ProductManagerMongo.js
│   │   │   └── CartManagerMongo.js
│   │   └── fs/
│   │       ├── ProductManagerFS.js
│   │       └── CartManagerFS.js
│   ├── models/
│   │   ├── product.model.js
│   │   └── cart.model.js
│   ├── routes/
│   │   ├── products.router.js
│   │   ├── carts.router.js
│   │   └── views.router.js
│   ├── controllers/
│   │   ├── products.controller.js
│   │   └── carts.controller.js
│   ├── utils/
│   │   ├── db.js
│   │   ├── socket.js
│   │   └── hbsHelpers.js
│   ├── views/
│   │   ├── layouts/main.handlebars
│   │   ├── products.handlebars
│   │   ├── productDetail.handlebars
│   │   ├── cart.handlebars
│   │   ├── realTimeProducts.handlebars
│   │   └── error.handlebars
│   └── public/
│       └── css/style.css
├── data/
│   ├── products.json             # FileSystem (legacy)
│   └── carts.json
├── .env
├── .env.example
└── package.json
```

---

## 🌐 Endpoints API

### Productos `/api/products`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/products` | Listar con paginación, filtros y orden |
| GET | `/api/products/:pid` | Obtener por ID |
| POST | `/api/products` | Crear producto |
| PUT | `/api/products/:pid` | Actualizar producto |
| DELETE | `/api/products/:pid` | Eliminar producto |

**Query params GET /api/products:**
- `limit` (default: 10)
- `page` (default: 1)
- `query` (categoría: figura/manga/poster/llavero/peluche o true/false para status)
- `sort` (asc / desc por precio)

### Carritos `/api/carts`

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/carts` | Crear carrito |
| GET | `/api/carts/:cid` | Ver carrito (con populate) |
| POST | `/api/carts/:cid/products/:pid` | Agregar producto |
| DELETE | `/api/carts/:cid/products/:pid` | Quitar producto |
| PUT | `/api/carts/:cid` | Reemplazar todos los productos |
| PUT | `/api/carts/:cid/products/:pid` | Actualizar cantidad |
| DELETE | `/api/carts/:cid` | Vaciar carrito |

---

## 🖥️ Vistas

| URL | Vista |
|-----|-------|
| `/products` | Catálogo con paginación y filtros |
| `/products/:pid` | Detalle del producto |
| `/carts/:cid` | Carrito específico |
| `/realtimeproducts` | Admin en tiempo real (WebSockets) |

---

## ⚡ WebSockets

La vista `/realtimeproducts` permite:
- Ver todos los productos en tiempo real
- Agregar un producto (se actualiza en todos los clientes instantáneamente)
- Eliminar un producto (idem)
