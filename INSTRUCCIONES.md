# 🚀 Cómo ejecutar la aplicación

## ✅ Configuración actualizada a Expo SDK 54

La aplicación ahora está configurada con:
- ✅ Expo SDK 54
- ✅ React Native 0.81.5
- ✅ React 19.1
- ✅ Escaneo real de códigos QR con cámara
- ✅ Compatible con Expo Go SDK 54

## 📱 Cómo usar la app

### Paso 1: Inicia el servidor

```bash
npm start
```

### Paso 2: Abre en Expo Go

1. Descarga **Expo Go** en tu celular si no lo tienes
2. Escanea el código QR de la terminal con Expo Go
3. La app se cargará en tu dispositivo

### Paso 3: Escanea códigos QR

1. Abre el menú lateral (botón ☰)
2. Selecciona un modo de escaneo (Entrada, Entrega, o Completo)
3. Toca el botón "TOCAR PARA ESCANEAR" 📷
4. La cámara se abrirá automáticamente
5. Apunta al código QR
6. ¡El código se escaneará automáticamente!

## 🎯 Características

- ✅ Escaneo real de códigos QR con cámara
- ✅ 3 modos de operación
- ✅ Historial de escaneos en tiempo real
- ✅ Validación automática
- ✅ Interfaz moderna y minimalista

## ⚠️ Importante

- La app necesita permisos de cámara para funcionar
- La primera vez que escanees, te pedirá permiso
- Solo funciona en dispositivos físicos (no en simulador web)

## 🖥️ Otras opciones para ejecutar

### En navegador web
```bash
npm run web
```

### En emulador Android (requiere Android Studio)
```bash
npm run android
```

### En simulador iOS (requiere Mac + Xcode)
```bash
npm run ios
```

## 🎯 Funcionalidades de la app

- **3 modos de escaneo**: Entrada, Entrega de Pasaporte, Pasaporte Completo
- **Simulación de escaneo**: Toca el área de escaneo para simular un QR
- **Historial en tiempo real**: Todos los escaneos se guardan en la sesión
- **Validación aleatoria**: 70% válidos, 30% inválidos (para demo)

## 🔧 Próximos pasos sugeridos

1. **Agregar escaneo real de QR**: Integrar `expo-camera` o `expo-barcode-scanner`
2. **Iconos y splash screen**: Agregar imágenes en la carpeta `assets/`
3. **Backend**: Conectar con API para validación real
4. **Persistencia**: Guardar escaneos con AsyncStorage

## 📂 Estructura del proyecto

```
├── App.tsx                    # Componente principal (raíz)
├── src/
│   ├── components/           # Componentes React Native
│   │   ├── Drawer.tsx       # Menú lateral
│   │   ├── ScannerView.tsx  # Vista de escaneo
│   │   ├── ResultBanner.tsx # Banner de resultado
│   │   └── ScanLog.tsx      # Historial de escaneos
│   └── types.ts             # Tipos TypeScript
├── app.json                  # Configuración de Expo
├── babel.config.js          # Configuración de Babel
└── package.json             # Dependencias
```

## ❓ Problemas comunes

### Error: "Expo CLI not found"
```bash
npm install -g expo-cli
```

### Error al iniciar
```bash
# Limpia caché
npm start -- --clear
```

### Puerto ocupado
```bash
# Usa otro puerto
npm start -- --port 8081
```
