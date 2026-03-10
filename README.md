# Arquitectura de Microservicios ShopSmart

## Resumen
ShopSmart está pasando de una arquitectura monolítica a un sistema basado en microservicios para abordar problemas de gestión de inventario, especialmente la sincronización entre múltiples almacenes.

## Microservicios
- **Inventory Service** (Puerto 3000): Gestiona el inventario global de productos y sincroniza stock de almacenes.
- **Warehouse Service** (Puerto 3001): Gestiona los almacenes individuales y sus inventarios.

## Endpoints

### Inventory Service (Puerto 3000)
#### Inventario
- `GET /api/inventory` - Obtener todos los items de inventario
- `GET /api/inventory/:productId` - Obtener inventario de un producto específico
- `POST /api/inventory` - Agregar o actualizar item de inventario
- `PUT /api/inventory/:productId` - Actualizar inventario de un producto
- `DELETE /api/inventory/:productId` - Eliminar item de inventario
- `POST /api/inventory/sync` - Sincronizar inventario con datos de warehouse-service

### Warehouse Service (Puerto 3001)
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
3. Accede a los servicios en:
   - Inventory Service: http://localhost:3000 (Swagger: /api-docs)
   - Warehouse Service: http://localhost:3001 (Swagger: /api-docs)

## Despliegue en Render
1. Construye y sube cada imagen Docker (inventory-service y warehouse-service) a un registro (Docker Hub u otro).
2. En Render crea dos Web Services usando las imágenes correspondientes.
3. Configura variables de entorno para cada servicio (`MONGO_URI` apuntando a la DB adecuada en MongoDB Atlas).
4. Actualiza cualquier URL hardcodeada (e.g., en inventory-service la dirección del warehouse-service si llamas directamente).

## Mejoras Futuras
- Agregar API Gateway para enrutamiento y autenticación.
- Implementar arquitectura basada en eventos con colas de mensajes (e.g., RabbitMQ) para sincronización en tiempo real.
- Agregar servicios de Producto y Pedido para funcionalidad completa de e-commerce.