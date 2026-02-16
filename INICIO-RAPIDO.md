# 🚀 Inicio Rápido - App de Escaneo QR

## ✅ Todo está listo!

La app ya está configurada para conectarse con tu backend en:
```
http://192.168.100.46:3003/api/scan
```

---

## 📋 Checklist Pre-Inicio

Antes de iniciar la app, verifica:

- [ ] Backend corriendo en `http://192.168.100.46:3003`
- [ ] Base de datos configurada y con datos de prueba
- [ ] Celular y PC en la misma red WiFi
- [ ] Firewall permite conexiones al puerto 3003

---

## 🎬 Iniciar la App

### 1. Instalar dependencias (si no lo has hecho):
```bash
npm install
```

### 2. Iniciar Expo:
```bash
npm start
```

### 3. Escanear QR con Expo Go:
- Abre Expo Go en tu celular
- Escanea el QR que aparece en la terminal
- Espera a que cargue la app

---

## 🎯 Usar la App

### Paso 1: Seleccionar Modo
1. Abre el menú (botón superior izquierdo)
2. Selecciona un modo:
   - **ENTRADA** - Control de acceso al evento
   - **ENTREGA DE PASAPORTE** - Registro de entrega
   - **PASAPORTE COMPLETO** - Verificación completa

### Paso 2: Escanear QR
1. Toca el botón "TOCAR PARA ESCANEAR"
2. Permite acceso a la cámara (primera vez)
3. Apunta al código QR

### Paso 3: Confirmar
1. Verás la información del participante
2. Confirma que los datos son correctos
3. Presiona "Registrar"

### Paso 4: Ver Resultado
- ✅ Verde = Escaneo exitoso
- ❌ Rojo = Error o QR inválido

---

## 🧪 Probar con QR de Prueba

Si tu backend tiene datos de prueba, puedes:

1. Generar un QR desde la web de registro
2. Escanearlo con la app
3. Verificar que se registre correctamente

### Crear QR de Prueba Online:
- Ve a: https://www.qr-code-generator.com/
- Ingresa un código de prueba (ej: "TEST-QR-001")
- Genera el QR
- Escanéalo con la app

**Nota:** El backend debe tener ese código en la base de datos.

---

## 📊 Ver Estadísticas (Opcional)

Si implementaste el endpoint de stats, puedes ver estadísticas:

1. Agrega esto en `App.tsx`:

```typescript
import { useEffect } from 'react';
import { getStats } from './src/services/scanService';

// Dentro del componente:
useEffect(() => {
  const loadStats = async () => {
    const result = await getStats();
    if (result.success) {
      console.log('📊 Estadísticas:', result.data);
    }
  };
  loadStats();
}, []);
```

2. Verás las stats en la consola de Expo

---

## 🎨 Colores Corporativos

La app usa tu paleta de colores:
- **Magenta Principal** (#B50095) - Botones, títulos
- **Cian Brillante** (#5FFBF1) - Acentos, bordes
- **Morado Oscuro** (#800080) - Texto, sombras
- **Blanco** (#FFFFFF) - Fondos limpios

---

## 🔄 Flujo Completo del Sistema

```
┌─────────────┐
│   WEB       │ → Usuario se registra
│  (Registro) │ → Genera QR único
└─────────────┘
       ↓
┌─────────────┐
│  BACKEND    │ → Guarda en DB
│  (API)      │ → QR listo para escanear
└─────────────┘
       ↓
┌─────────────┐
│   APP       │ → Escanea QR
│  (Móvil)    │ → Valida con backend
│             │ → Registra entrada/entrega/completo
└─────────────┘
```

---

## 📱 Modos de Operación

### 1. ENTRADA (Control de Acceso)
- Primer escaneo del participante
- Registra hora de llegada
- Valida que el QR sea válido

### 2. ENTREGA DE PASAPORTE
- Segundo paso del flujo
- Requiere que ya haya registrado entrada
- Entrega el pasaporte físico

### 3. PASAPORTE COMPLETO
- Último paso del flujo
- Requiere que ya tenga el pasaporte
- Marca como completado

---

## 🐛 Problemas Comunes

### "No se pudo conectar con el servidor"
→ Verifica que el backend esté corriendo
→ Revisa que estés en la misma red WiFi
→ Prueba abrir `http://192.168.100.46:3003/api/scan/stats` en el navegador

### "Código QR no válido"
→ El QR no existe en la base de datos
→ Verifica que se generó correctamente desde la web

### "Ya se registró la entrada"
→ El participante ya escaneó en ese modo
→ Esto es correcto, previene duplicados

### Cámara no funciona
→ Verifica permisos de cámara en el celular
→ Reinicia la app
→ Reinstala Expo Go si persiste

---

## 📚 Documentación Adicional

- `API-BACKEND.md` - Endpoints del backend
- `DATABASE-SCHEMA.md` - Estructura de la base de datos
- `CONEXION-API.md` - Guía detallada de conexión
- `GUIA-FRONTEND-APP.md` - Guía original de implementación

---

## ✨ Características Implementadas

- ✅ Escaneo de QR con cámara
- ✅ Validación en tiempo real con backend
- ✅ 3 modos de operación (entrada/entrega/completo)
- ✅ Historial de escaneos
- ✅ Alertas de confirmación
- ✅ Manejo de errores
- ✅ Diseño con colores corporativos
- ✅ Animaciones suaves
- ✅ Iconos profesionales

---

## 🎉 ¡Listo para Usar!

Tu app está completamente configurada y lista para escanear QR codes.

**Comando para iniciar:**
```bash
npm start
```

**¿Necesitas ayuda?**
Revisa los archivos de documentación o los logs en la consola de Expo.
