# Levain

E-commerce simple de café y panadería. Proyecto final de un bootcamp de frontend con React.

- **Frontend:** Vite + React + TypeScript, React Router (con `Outlet`), Context, formularios controlados y validación con Zod.
- **Backend:** NestJS + TypeORM + PostgreSQL, con la menor cantidad de archivos posible.
- **Pago simulado:** la compra llega hasta el checkout y desde ahí se simula. No hay pasarela de pago.

> **Nota para la clase:** los nombres del código (variables, funciones, componentes, endpoints, campos) están en
> español a propósito, para que sea fácil de leer. Como buena práctica profesional, en un proyecto real deberían
> escribirse en inglés.

## Estructura

```
levain/
├── levain-front/        React
├── levain-api/          NestJS
├── docker-compose.yml   PostgreSQL
├── .env.example         Variables de ejemplo (copiar a .env)
└── README.md
```

## Requisitos

Node 20 o superior y Docker.

## Cómo levantarlo

### 1. Base de datos

```bash
cp .env.example .env
docker compose up -d
```

PostgreSQL queda en `localhost:5433` (el puerto 5433 evita chocar con un Postgres local en el 5432).
Los datos viven en un volumen de Docker, así que sobreviven a reinicios.

### 2. Backend (puerto 4000)

```bash
cd levain-api
npm install
npm run seed        # carga los 10 productos de ejemplo (se puede repetir)
npm run start:dev
```

Las tablas se crean solas al arrancar (`synchronize: true`, solo para desarrollo).

### 3. Frontend (puerto 5173)

```bash
cd levain-front
npm install
npm run dev
```

Abre http://localhost:5173

> Si cambias el puerto de la API, actualiza `API_PUERTO` en `.env` y `URL_API` en
> `levain-front/src/api/cliente.ts`.

## Credenciales del admin

Entra en http://localhost:5173/admin/login (o con el enlace "Administración" del pie de página).

| Correo | Clave |
|---|---|
| `admin@levain.cl` | `admin123` |

Son un único usuario definido en `.env` (`ADMIN_CORREO` y `ADMIN_CLAVE`). No hay tabla de usuarios ni registro.

## Tarjeta de prueba para el checkout

Cualquier dato que cumpla el formato sirve, por ejemplo: `4242 4242 4242 4242`, vencimiento `08/29`, CVV `123`.
Los datos de la tarjeta se validan en el navegador y **nunca se envían** al servidor.

## Rutas del frontend

| Ruta | Pantalla |
|---|---|
| `/` | Inicio |
| `/productos` | Catálogo con filtro por categoría |
| `/productos/:id` | Detalle del producto |
| `/carrito` | Carrito (se guarda en `localStorage`) |
| `/checkout` | Checkout simulado |
| `/pedido/:id` | Confirmación del pedido |
| `/admin/login` | Login del admin |
| `/admin/productos` | Tabla de productos (protegida) |
| `/admin/productos/nuevo` | Crear producto (protegida) |
| `/admin/productos/:id/editar` | Editar producto (protegida) |
| `/admin/pedidos` | Pedidos (protegida) |

## Endpoints de la API

Los endpoints de `/admin/*` exigen el header `Authorization: Bearer <token>`.

### Documentación interactiva (Swagger)

Con la API corriendo, abre http://localhost:4000/docs. Ahí se pueden probar todos los endpoints.
Para los de `/admin`: ejecuta `POST /auth/ingresar`, copia el `token` de la respuesta, pulsa **Authorize**
y pégalo.

### Públicos

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/productos` | Productos activos. Filtro opcional: `?categoria=cafe` o `?categoria=pan` |
| GET | `/productos/:id` | Un producto activo |
| POST | `/pedidos` | Crea un pedido. Calcula el total en el servidor, descuenta stock y lo deja en estado `pagado` (pago simulado) |
| GET | `/pedidos/:id` | Un pedido con sus items |

Cuerpo de `POST /pedidos`:

```json
{
  "nombreCliente": "Ana Pérez",
  "correoCliente": "ana@correo.cl",
  "direccion": "Av. Providencia 1234, Santiago",
  "items": [{ "productoId": 1, "cantidad": 2 }]
}
```

### Admin

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/ingresar` | Recibe `{ "correo", "clave" }` y devuelve `{ "token" }` (JWT) |
| GET | `/admin/productos` | Todos los productos, incluidos los inactivos |
| GET | `/admin/productos/:id` | Un producto (activo o no), para el formulario de edición |
| POST | `/admin/productos` | Crea un producto |
| PUT | `/admin/productos/:id` | Actualiza un producto |
| DELETE | `/admin/productos/:id` | Elimina un producto |
| GET | `/admin/pedidos` | Lista de pedidos (solo lectura) |

Cuerpo de `POST` y `PUT /admin/productos`:

```json
{
  "nombre": "Focaccia",
  "descripcion": "Focaccia con aceite de oliva y romero.",
  "precio": 3900,
  "categoria": "pan",
  "imagenUrl": "https://images.pexels.com/photos/40321541/pexels-photo-40321541.jpeg",
  "stock": 12,
  "activo": true
}
```

El precio es un entero en pesos chilenos y `categoria` solo acepta `cafe` o `pan`.

## Qué mirar en el código (guía para explicar)

**Frontend** (`levain-front/src`)

| Concepto | Dónde verlo |
|---|---|
| Layouts con `Outlet` | `layouts/LayoutPublico.tsx`, `layouts/LayoutAdmin.tsx` |
| Rutas y ruta protegida | `App.tsx`, `components/RutaProtegida.tsx` |
| Componentes con props y `children` | `components/TarjetaProducto.tsx`, `components/Campo.tsx` |
| Context + `useState` (inmutable) | `context/CarritoContext.tsx`, `context/SesionContext.tsx` |
| `useEffect` + carga, error y `try/catch` | `pages/Catalogo.tsx`, `pages/DetalleProducto.tsx` |
| `useParams` | `pages/DetalleProducto.tsx`, `pages/ConfirmacionPedido.tsx` |
| Formularios controlados | `pages/Checkout.tsx`, `pages/admin/Login.tsx` |
| Validación con Zod | `schemas/` y `utils/validar.ts` |
| Llamadas a la API | `api/cliente.ts` |
| Colores y tipografías | Variables `:root` al inicio de `index.css` |

**Backend** (`levain-api/src`)

| Concepto | Dónde verlo |
|---|---|
| Entidades TypeORM | `productos/producto.entity.ts`, `pedidos/*.entity.ts` |
| Validación con DTO | `*.dto.ts` y `ValidationPipe` en `main.ts` |
| Swagger | `main.ts` (configuración) y `@ApiProperty` en los `*.dto.ts` |
| Crear pedido (transacción y stock) | `pedidos/pedidos.controller.ts` |
| Login y guard JWT | `auth/auth.controller.ts`, `auth/auth.guard.ts` |
| Seed | `seed.ts` |

## Scripts

| Dónde | Comando | Qué hace |
|---|---|---|
| `levain-front` | `npm run dev` | Servidor de desarrollo |
| `levain-front` | `npm run build` | Compila para producción |
| `levain-api` | `npm run start:dev` | API con recarga automática |
| `levain-api` | `npm run seed` | Recarga los productos de ejemplo |
| `levain-api` | `npm run build` | Compila la API |

Para borrar todos los datos y empezar de cero: `docker compose down -v` y volver al paso 1.
