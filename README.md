# Arquitectura de Microservicios ShopSmart

## Resumen
ShopSmart está pasando de una arquitectura monolítica a un sistema basado en microservicios para abordar problemas de gestión de inventario, especialmente la sincronización entre múltiples almacenes.

## Microservicios
- **Servicio ShopSmart**: Gestiona el inventario general de productos, almacenes y maneja actualizaciones en tiempo real.

## Endpoints

### Servicio ShopSmart (Puerto 3000)
#### Inventario
- `GET /api/inventory` - Obtener todos los items de inventario
- `GET /api/inventory/:productId` - Obtener inventario de un producto específico
- `POST /api/inventory` - Agregar o actualizar item de inventario
- `PUT /api/inventory/:productId` - Actualizar inventario de un producto
- `DELETE /api/inventory/:productId` - Eliminar item de inventario
- `POST /api/inventory/sync` - Sincronizar inventario con almacenes

#### Almacenes
- `GET /api/warehouses` - Obtener todos los almacenes
- `POST /api/warehouses` - Crear un nuevo almacén
- `GET /api/warehouses/:id/inventory` - Obtener inventario de un almacén
- `PUT /api/warehouses/:id/inventory` - Actualizar inventario en un almacén

## Pila Tecnológica
- Node.js con Express.js
- MongoDB para almacenamiento de datos
- Swagger para documentación de APIs
- Docker para contenerización

## Ejecutar Localmente
1. Asegúrate de tener Docker y Docker Compose instalados.
2. Ejecuta `docker-compose up --build` desde el directorio raíz.
3. Accede al servicio en:
   - Servicio ShopSmart: http://localhost:3000
   - Documentación Swagger: http://localhost:3000/api-docs

## Despliegue en Render
1. Construye y sube la imagen Docker a un registro (e.g., Docker Hub).
2. Crea un servicio en Render usando la imagen Docker.
3. Configura variables de entorno para la conexión a MongoDB (usa MongoDB Atlas para la base de datos en la nube).
4. Actualiza cualquier URL hardcodeada si es necesario.

## Mejoras Futuras
- Agregar API Gateway para enrutamiento y autenticación.
- Implementar arquitectura basada en eventos con colas de mensajes (e.g., RabbitMQ) para sincronización en tiempo real.
- Agregar servicios de Producto y Pedido para funcionalidad completa de e-commerce.