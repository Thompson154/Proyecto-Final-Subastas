


# README - Sistema de Subastas en Tiempo Real

Basándome en el análisis del repositorio, aquí tienes un README completo para el proyecto:

# 🏆 Sistema de Subastas en Tiempo Real

Una plataforma moderna de subastas en línea construida con React, TypeScript y Express.js que permite a los usuarios participar en subastas en tiempo real con actualizaciones instantáneas.

## ✨ Características Principales

- **Subastas en Tiempo Real**: Sistema de pujas con actualizaciones instantáneas usando Server-Sent Events
- **Autenticación de Usuarios**: Sistema completo de registro e inicio de sesión
- **Interfaz Moderna**: Diseño responsivo con Tailwind CSS y efectos visuales 3D
- **Validación de Pujas**: Validación tanto en frontend como backend para garantizar integridad
- **Historial de Pujas**: Seguimiento completo de todas las ofertas realizadas
- **Estados de Subasta**: Gestión automática de estados (futuro, activo, finalizado)

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** con TypeScript
- **Vite** como bundler y herramienta de desarrollo [1](#0-0) 
- **Tailwind CSS** para estilos [2](#0-1) 
- **Zustand** para gestión de estado
- **React Router** para navegación
- **Axios** para comunicación HTTP

### Backend
- **Express.js** servidor en puerto 5010
- **JSON Server** API mock en puerto 3000
- **Server-Sent Events** para actualizaciones en tiempo real
- **CORS** para comunicación cross-origin

## 📁 Estructura del Proyecto

```
src/
├── api/           # Configuración de cliente HTTP
├── components/    # Componentes reutilizables de React
├── guards/        # Protección de rutas
├── hooks/         # Custom hooks
├── i18n/          # Internacionalización
├── interfaces/    # Definiciones de TypeScript
├── layout/        # Componentes de layout
├── lib/           # Utilidades y librerías
├── pages/         # Páginas principales de la aplicación
├── routes/        # Configuración de rutas
├── services/      # Servicios de la aplicación
└── store/         # Gestión de estado global
``` [3](#0-2) 

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/Thompson154/Proyecto-Final-Subastas.git
   cd Proyecto-Final-Subastas
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Inicia el servidor JSON (puerto 3000)**
   ```bash
   npx json-server --watch db.json --port 3000
   ```

4. **Inicia el servidor Express (puerto 5010)**
   ```bash
   node index.js
   ```

5. **Inicia la aplicación frontend**
   ```bash
   npm run dev
   ```


## 🏗️ Arquitectura del Sistema

### Componentes Principales

- **Frontend (React)**: Interfaz de usuario con componentes modulares [4](#0-3) 
- **Backend Express**: Servidor de tiempo real para gestión de pujas
- **JSON Server**: API mock para operaciones CRUD [5](#0-4) 

### Páginas Principales

- **HomePage**: Página principal con productos destacados [6](#0-5) 
- **ProductsPage**: Lista de todos los productos en subasta [7](#0-6) 
- **ProductPage**: Página detallada de producto con funcionalidad de puja [8](#0-7) 
- **LoginPage/RegisterPage**: Autenticación de usuarios [9](#0-8) [10](#0-9) 

### Componentes Destacados

- **ProductCard**: Tarjeta de producto con información básica [11](#0-10) 
- **ProductCard3d**: Versión con efectos visuales 3D [12](#0-11) 
- **ModalComponent**: Modal reutilizable para diferentes acciones [13](#0-12) 

## 📊 Base de Datos

El sistema utiliza un archivo JSON como base de datos con las siguientes colecciones:

- **users**: Información de usuarios registrados
- **products**: Catálogo de productos en subasta
- **productBids**: Historial de pujas realizadas
- **productVisits**: Seguimiento de visitas a productos

## 🔄 Flujo de Pujas en Tiempo Real

1. El usuario envía una puja desde la interfaz
2. El frontend valida la puja localmente
3. Se envía la puja al servidor Express via HTTP POST
4. El servidor valida que la puja sea mayor al precio actual
5. Se actualiza el estado del producto en memoria
6. Se envía confirmación al cliente que realizó la puja
7. Se difunde la actualización a todos los clientes conectados via SSE

## 🛡️ Características de Seguridad

- **Autenticación**: Sistema de login/registro de usuarios
- **Rutas Protegidas**: Acceso controlado a funcionalidades [14](#0-13) 

## 🎨 Estilos y UI

- **Tailwind CSS**: Framework de utilidades CSS
- **Componentes Responsivos**: Diseño adaptable a diferentes pantallas
- **Efectos 3D**: Componentes visuales avanzados
- **Animaciones**: Transiciones suaves entre estados

## 📝 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run preview`: Previsualiza la build de producción
