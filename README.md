# QR Event Scanner 📱

Aplicación móvil para escaneo de códigos QR en eventos, construida con Expo y React Native.

## ✨ Características

- 3 modos de escaneo: Entrada, Entrega de Pasaporte, Pasaporte Completo
- Historial de escaneos en tiempo real
- Interfaz minimalista y moderna
- Validación de códigos QR
- Simulación de escaneo (sin necesidad de cámara para desarrollo)

## 🚀 Instalación

1. Instala Expo CLI globalmente (si no lo tienes):
```bash
npm install -g expo-cli
```

2. Las dependencias ya están instaladas. Si necesitas reinstalarlas:
```bash
npm install
```

3. Inicia la aplicación:
```bash
npm start
```

4. Opciones para ejecutar:
   - Escanea el código QR con la app **Expo Go** en tu dispositivo móvil
   - Presiona `a` para abrir en emulador Android
   - Presiona `i` para abrir en simulador iOS
   - Presiona `w` para abrir en navegador web

## 📱 Comandos disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm run android` - Abre en emulador Android
- `npm run ios` - Abre en simulador iOS
- `npm run web` - Abre en navegador web

## 📁 Estructura del proyecto

```
├── App.tsx                 # Componente principal
├── src/
│   ├── components/        # Componentes React Native
│   │   ├── Drawer.tsx
│   │   ├── ScannerView.tsx
│   │   ├── ResultBanner.tsx
│   │   └── ScanLog.tsx
│   └── types.ts          # Definiciones TypeScript
├── app.json              # Configuración de Expo
├── babel.config.js       # Configuración de Babel
└── package.json          # Dependencias
```

## 🛠 Tecnologías

- Expo SDK 52
- React Native 0.76
- TypeScript
- React Native Safe Area Context

## 📝 Notas

- La aplicación simula el escaneo de QR para facilitar el desarrollo
- Para implementar escaneo real, integra `expo-camera` o `expo-barcode-scanner`
- Los assets (iconos, splash screen) deben agregarse en la carpeta `assets/`

## 🎯 Próximos pasos

1. Agregar iconos y splash screen en la carpeta `assets/`
2. Implementar escaneo real de QR con cámara
3. Conectar con backend para validación real
4. Agregar persistencia de datos local
