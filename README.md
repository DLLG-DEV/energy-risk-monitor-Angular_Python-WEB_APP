# energy-risk-monitor-Angular_Python-WEB_APP
# 🌎 Energy Risk Monitoring Platform

> Plataforma web para el monitoreo de eventos naturales globales utilizando la API de NASA EONET, con análisis predictivo, alertas inteligentes y visualización geoespacial para apoyar la evaluación de riesgos en infraestructura energética.

---

## 📖 Descripción

Energy Risk Monitoring Platform es una aplicación Full Stack desarrollada con **Angular** y **FastAPI** que permite recopilar, almacenar y analizar eventos naturales registrados por la NASA.

La plataforma obtiene información histórica de los últimos cinco años, normaliza los datos geográficos, identifica el país donde ocurrió cada evento y genera pronósticos para los próximos tres meses.

Además, los usuarios pueden crear alarmas personalizadas por país y/o categoría para recibir notificaciones automáticas cuando se detecten nuevos eventos que cumplan sus criterios.

---

# 🚀 Características

### 🔐 Autenticación

- Registro de usuarios.
- Inicio de sesión con JWT.
- Gestión segura de contraseñas.
- Control de acceso basado en roles y permisos.

---

### 🌍 Monitoreo de Eventos

- Obtención automática de eventos desde NASA EONET.
- Importación de los últimos 5 años de información.
- Actualización automática de nuevos eventos.
- Normalización y almacenamiento en base de datos.
- Enriquecimiento de datos mediante geolocalización inversa para identificar el país.

---

### 📊 Dashboard

Visualización rápida de información relevante:

- Total de eventos registrados.
- Eventos por categoría.
- Eventos por país.
- Últimos eventos detectados.
- Resumen de alarmas activas.
- Estadísticas generales.

---

### 🗺️ Mapa de Calor

Visualización geográfica de los eventos mediante un Heatmap interactivo.

Permite filtrar por:

- Período
- Categoría
- País

---

### 📈 Forecast

Generación de predicciones para los próximos tres meses utilizando modelos de análisis de series temporales.

Incluye:

- Pronóstico por categoría.
- Pronóstico por región.
- Gráficas de tendencia.
- Tablas de resultados.

---

### 🔔 Sistema de Alarmas

Los usuarios pueden crear reglas personalizadas para recibir notificaciones cuando aparezcan nuevos eventos.

Las alarmas pueden configurarse por:

- País
- Categoría
- País + Categoría

---

### 📧 Notificaciones

Cuando un nuevo evento coincide con alguna alarma:

- Se detecta automáticamente.
- Se registra en el sistema.
- Se envía una notificación por correo electrónico.

---

### ⚙️ Panel de Administración

Administración completa del sistema.

Permite:

- Gestión de usuarios.
- Administración de roles.
- Gestión de permisos.
- Activación y desactivación de usuarios.

---

# 🏗️ Arquitectura

```
                Angular Frontend
                        │
                        │ REST API
                        ▼
                FastAPI Backend
                        │
        ┌───────────────┼────────────────┐
        │               │                │
        ▼               ▼                ▼
 PostgreSQL      NASA EONET API    Email Service
        │
        ▼
 Forecast Engine
```

---

# 🧩 Módulos

- Authentication
- Dashboard
- Events
- Heatmap
- Forecast
- Alerts
- Administration

---

# 🛠️ Tecnologías

## Frontend

- Angular
- TypeScript
- Angular Material
- Leaflet
- Chart.js

---

## Backend

- Python
- FastAPI
- SQLAlchemy
- Alembic
- Pydantic
- JWT Authentication

---

## Base de Datos

- PostgreSQL

---

## Librerías

- Pandas
- NumPy
- APScheduler
- HTTPX
- Passlib
- Python-Jose

---

# 📂 Estructura del proyecto

```
project/

│
├── backend/
│   ├── app/
│   ├── api/
│   ├── services/
│   ├── models/
│   ├── schemas/
│   ├── utils/
│   ├── database/
│   └── main.py
│
├── frontend/
│   ├── src/
│   ├── app/
│   ├── assets/
│   └── environments/
│
└── README.md
```

---

# 🔄 Flujo de funcionamiento

```
NASA EONET API

        │

        ▼

Obtención de eventos

        │

        ▼

Normalización

        │

        ▼

Geolocalización

        │

        ▼

Almacenamiento

        │

        ▼

Forecast

        │

        ▼

Comparación con alarmas

        │

        ▼

Notificación por Email
```

---

# 🎯 Funcionalidades principales

✔ Autenticación mediante JWT

✔ Gestión de usuarios

✔ Roles y permisos

✔ Consumo de NASA EONET API

✔ Almacenamiento de eventos históricos

✔ Normalización de datos geográficos

✔ Enriquecimiento con información del país

✔ Forecast de eventos naturales

✔ Heatmap interactivo

✔ Sistema de alarmas

✔ Envío automático de correos

✔ Dashboard con indicadores

---

# 📌 Objetivo

Desarrollar una plataforma capaz de monitorear eventos naturales a nivel mundial para apoyar la evaluación de riesgos sobre infraestructura energética mediante visualización, análisis histórico y predicción de eventos futuros.

---

# 👨‍💻 Autor

**Leo Lopez**

Backend Developer | Python | FastAPI | Angular | PostgreSQL

---