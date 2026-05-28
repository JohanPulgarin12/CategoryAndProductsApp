## Usuario y contraseña para el login

```
Usuario: vwa-us
Contraseña: Bdh%&2AeJ=9!JFBS202029se86e
```

# Inventory OS — Dashboard Administrativo

Stack: React 18 + Vite + TypeScript + TailwindCSS + Recharts  
Backend: .NET 8 API con JWT

---

## Estructura del repositorio

```
/
├── api/        → Proyecto .NET 8 (JphTaskManagementApi)
└── web/        → Dashboard React (inventory-dashboard)
```

---

## Configuración del Backend (`/api`)

### 1. Encriptación de la cadena de conexión

La API usa el programa `comconfig` para encriptar la cadena de conexión antes de guardarla en `appsettings.json`.

**Pasos:**
1. Abrir `comconfig.exe`
2. Ingresar la cadena de conexión en el campo **String de conexión**:
   ```
   Data Source=<SERVER>;Initial Catalog=<DB>;Integrated Security=True;TrustServerCertificate=True;
   ```
3. Hacer clic en **Encriptar**
4. Copiar el resultado y pegarlo en `appsettings.json`:
   ```json
   "ConnectionStrings": {
     "ConnetionGenerico": "<CADENA_ENCRIPTADA>",
     "ConnetionToken": "<CADENA_ENCRIPTADA>"
   }
   ```

### 2. Migraciones EF Core

```bash
# En Package Manager Console de Visual Studio
Add-Migration InitialCreate -Project JphTaskManagementApi.Infrastructure -StartupProject JphTaskManagementApi.WebAPI
Update-Database -Project JphTaskManagementApi.Infrastructure -StartupProject JphTaskManagementApi.WebAPI
```

Esto crea las tablas `Products`, `Categories`, `ProductStatuses` e inserta los datos maestros (seeder automático).

### 3. Ejecutar pruebas unitarias del backend

```bash
# Desde Visual Studio: Test > Run All Tests
# O desde terminal:
dotnet test
```

---

## Configuración del Frontend (`/web`)

### 1. Variables de entorno

```bash
cp .env.example .env
```

Edita `.env`:
```
VITE_API_URL=https://localhost:44358
```

Ajusta el puerto según el de tu API en Visual Studio.

### 2. Instalación y ejecución

```bash
cd web
npm install
npm run dev
```

### 3. Ejecutar pruebas unitarias del frontend

```bash
# Correr todas las pruebas
npm run test

# Modo watch (desarrollo)
npm run test:watch

# Con UI visual
npm run test:ui
```

Las pruebas cubren:
- `validators.test.ts` → lógica de validación de formularios
- `KpiCard.test.tsx` → componente de tarjetas KPI
- `useInventorySummary.test.ts` → hook de reporte con mock de API

---

## Endpoints consumidos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/Token/Authentication` | Login JWT |
| GET | `/api/Products/GetProducts` | Listar productos |
| POST | `/api/Products/CreateProduct` | Crear producto |
| PATCH | `/api/Products/UpdateProduct` | Actualizar producto |
| DELETE | `/api/Products/DeleteProduct/{id}` | Eliminar producto |
| GET | `/api/Categories/GetCategories` | Listar categorías |
| POST | `/api/Categories/CreateCategory` | Crear categoría |
| PUT | `/api/Categories/UpdateCategory` | Actualizar categoría |
| DELETE | `/api/Categories/DeleteCategory/{id}` | Eliminar categoría |
| GET | `/api/Inventory/summary` | Resumen del inventario |
