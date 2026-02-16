# Esquema de Base de Datos - Sistema de Escaneo QR

## Descripción General
Este documento describe las tablas necesarias para el sistema de escaneo QR. El esquema está diseñado para manejar registro de participantes, generación de QR y tracking de escaneos.

---

## Tablas Requeridas

### 1. participants (Participantes)
Almacena la información de los participantes registrados desde la web.

```sql
CREATE TABLE participants (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  qr_code VARCHAR(100) UNIQUE NOT NULL,
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('active', 'inactive', 'cancelled') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_qr_code (qr_code),
  INDEX idx_email (email),
  INDEX idx_status (status)
);
```

**Campos:**
- `id`: UUID único del participante
- `name`: Nombre completo
- `email`: Email único
- `phone`: Teléfono (opcional)
- `qr_code`: Código QR único generado
- `registration_date`: Fecha de registro
- `status`: Estado del participante
- `created_at`: Fecha de creación
- `updated_at`: Fecha de última actualización

---

### 2. scans (Escaneos)
Registra todos los escaneos realizados por la app móvil.

```sql
CREATE TABLE scans (
  id VARCHAR(36) PRIMARY KEY,
  participant_id VARCHAR(36) NOT NULL,
  qr_code VARCHAR(100) NOT NULL,
  mode ENUM('entrada', 'entrega', 'completo') NOT NULL,
  status ENUM('valid', 'invalid', 'duplicate') DEFAULT 'valid',
  scanned_at TIMESTAMP NOT NULL,
  device_id VARCHAR(100),
  device_info JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
  INDEX idx_participant_id (participant_id),
  INDEX idx_qr_code (qr_code),
  INDEX idx_mode (mode),
  INDEX idx_scanned_at (scanned_at),
  INDEX idx_status (status)
);
```

**Campos:**
- `id`: UUID único del escaneo
- `participant_id`: ID del participante
- `qr_code`: Código QR escaneado
- `mode`: Modo de escaneo (entrada/entrega/completo)
- `status`: Estado del escaneo
- `scanned_at`: Timestamp del escaneo
- `device_id`: ID del dispositivo que escaneó
- `device_info`: Información adicional del dispositivo (JSON)
- `created_at`: Fecha de creación del registro

---

### 3. participant_status (Estado del Participante)
Tracking del estado actual de cada participante en el flujo del evento.

```sql
CREATE TABLE participant_status (
  participant_id VARCHAR(36) PRIMARY KEY,
  has_entered BOOLEAN DEFAULT FALSE,
  entrada_at TIMESTAMP NULL,
  has_passport BOOLEAN DEFAULT FALSE,
  entrega_at TIMESTAMP NULL,
  is_complete BOOLEAN DEFAULT FALSE,
  completo_at TIMESTAMP NULL,
  last_scan_at TIMESTAMP NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
  INDEX idx_has_entered (has_entered),
  INDEX idx_has_passport (has_passport),
  INDEX idx_is_complete (is_complete)
);
```

**Campos:**
- `participant_id`: ID del participante (PK y FK)
- `has_entered`: Si ya registró entrada
- `entrada_at`: Timestamp de entrada
- `has_passport`: Si ya recibió el pasaporte
- `entrega_at`: Timestamp de entrega
- `is_complete`: Si completó el pasaporte
- `completo_at`: Timestamp de completado
- `last_scan_at`: Último escaneo realizado
- `updated_at`: Última actualización

---

### 4. scan_logs (Logs de Escaneo)
Registro detallado de todos los intentos de escaneo (exitosos y fallidos).

```sql
CREATE TABLE scan_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  qr_code VARCHAR(100) NOT NULL,
  mode ENUM('entrada', 'entrega', 'completo') NOT NULL,
  success BOOLEAN NOT NULL,
  error_code VARCHAR(50),
  error_message TEXT,
  participant_id VARCHAR(36),
  device_id VARCHAR(100),
  ip_address VARCHAR(45),
  user_agent TEXT,
  scanned_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_qr_code (qr_code),
  INDEX idx_success (success),
  INDEX idx_scanned_at (scanned_at),
  INDEX idx_participant_id (participant_id)
);
```

**Campos:**
- `id`: ID autoincremental
- `qr_code`: Código QR escaneado
- `mode`: Modo de escaneo
- `success`: Si el escaneo fue exitoso
- `error_code`: Código de error (si aplica)
- `error_message`: Mensaje de error
- `participant_id`: ID del participante (si se encontró)
- `device_id`: ID del dispositivo
- `ip_address`: IP del dispositivo
- `user_agent`: User agent del dispositivo
- `scanned_at`: Timestamp del escaneo
- `created_at`: Fecha de creación del log

---

### 5. devices (Dispositivos) - Opcional
Registro de dispositivos autorizados para escanear.

```sql
CREATE TABLE devices (
  id VARCHAR(36) PRIMARY KEY,
  device_name VARCHAR(255) NOT NULL,
  device_id VARCHAR(100) UNIQUE NOT NULL,
  device_type ENUM('mobile', 'tablet', 'scanner') DEFAULT 'mobile',
  is_active BOOLEAN DEFAULT TRUE,
  last_used_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_device_id (device_id),
  INDEX idx_is_active (is_active)
);
```

**Campos:**
- `id`: UUID único del dispositivo
- `device_name`: Nombre del dispositivo
- `device_id`: ID único del dispositivo
- `device_type`: Tipo de dispositivo
- `is_active`: Si está activo
- `last_used_at`: Último uso
- `created_at`: Fecha de creación
- `updated_at`: Última actualización

---

## Relaciones entre Tablas

```
participants (1) -----> (N) scans
participants (1) -----> (1) participant_status
participants (1) -----> (N) scan_logs
devices (1) -----> (N) scans
```

---

## Vistas Útiles

### Vista: daily_stats
Estadísticas diarias de escaneos.

```sql
CREATE VIEW daily_stats AS
SELECT 
  DATE(scanned_at) as scan_date,
  mode,
  COUNT(*) as total_scans,
  COUNT(DISTINCT participant_id) as unique_participants,
  SUM(CASE WHEN status = 'valid' THEN 1 ELSE 0 END) as valid_scans,
  SUM(CASE WHEN status = 'invalid' THEN 1 ELSE 0 END) as invalid_scans
FROM scans
GROUP BY DATE(scanned_at), mode;
```

### Vista: participant_progress
Progreso de cada participante.

```sql
CREATE VIEW participant_progress AS
SELECT 
  p.id,
  p.name,
  p.email,
  p.qr_code,
  ps.has_entered,
  ps.entrada_at,
  ps.has_passport,
  ps.entrega_at,
  ps.is_complete,
  ps.completo_at,
  CASE 
    WHEN ps.is_complete THEN 'Completo'
    WHEN ps.has_passport THEN 'Pasaporte Entregado'
    WHEN ps.has_entered THEN 'Entrada Registrada'
    ELSE 'Pendiente'
  END as current_status
FROM participants p
LEFT JOIN participant_status ps ON p.id = ps.participant_id
WHERE p.status = 'active';
```

---

## Índices Adicionales Recomendados

```sql
-- Para búsquedas rápidas por fecha
CREATE INDEX idx_scans_date ON scans(DATE(scanned_at));

-- Para reportes de participantes activos
CREATE INDEX idx_participants_active ON participants(status, registration_date);

-- Para búsquedas de logs por fecha
CREATE INDEX idx_logs_date ON scan_logs(DATE(scanned_at));

-- Índice compuesto para validaciones
CREATE INDEX idx_participant_mode ON scans(participant_id, mode, scanned_at);
```

---

## Triggers Recomendados

### Trigger: Actualizar participant_status después de escaneo

```sql
DELIMITER //

CREATE TRIGGER after_scan_insert
AFTER INSERT ON scans
FOR EACH ROW
BEGIN
  -- Actualizar o crear registro en participant_status
  INSERT INTO participant_status (
    participant_id,
    has_entered,
    entrada_at,
    has_passport,
    entrega_at,
    is_complete,
    completo_at,
    last_scan_at
  )
  VALUES (
    NEW.participant_id,
    CASE WHEN NEW.mode = 'entrada' THEN TRUE ELSE FALSE END,
    CASE WHEN NEW.mode = 'entrada' THEN NEW.scanned_at ELSE NULL END,
    CASE WHEN NEW.mode = 'entrega' THEN TRUE ELSE FALSE END,
    CASE WHEN NEW.mode = 'entrega' THEN NEW.scanned_at ELSE NULL END,
    CASE WHEN NEW.mode = 'completo' THEN TRUE ELSE FALSE END,
    CASE WHEN NEW.mode = 'completo' THEN NEW.scanned_at ELSE NULL END,
    NEW.scanned_at
  )
  ON DUPLICATE KEY UPDATE
    has_entered = CASE WHEN NEW.mode = 'entrada' THEN TRUE ELSE has_entered END,
    entrada_at = CASE WHEN NEW.mode = 'entrada' THEN NEW.scanned_at ELSE entrada_at END,
    has_passport = CASE WHEN NEW.mode = 'entrega' THEN TRUE ELSE has_passport END,
    entrega_at = CASE WHEN NEW.mode = 'entrega' THEN NEW.scanned_at ELSE entrega_at END,
    is_complete = CASE WHEN NEW.mode = 'completo' THEN TRUE ELSE is_complete END,
    completo_at = CASE WHEN NEW.mode = 'completo' THEN NEW.scanned_at ELSE completo_at END,
    last_scan_at = NEW.scanned_at;
END//

DELIMITER ;
```

---

## Datos de Ejemplo

### Insertar participante de prueba:
```sql
INSERT INTO participants (id, name, email, qr_code, status)
VALUES (
  UUID(),
  'Juan Pérez',
  'juan@example.com',
  'QR-ABC123XYZ789',
  'active'
);
```

### Consultar estado de participante:
```sql
SELECT 
  p.name,
  p.email,
  ps.has_entered,
  ps.has_passport,
  ps.is_complete
FROM participants p
LEFT JOIN participant_status ps ON p.id = ps.participant_id
WHERE p.qr_code = 'QR-ABC123XYZ789';
```

---

## Notas de Implementación

### Performance
- Usar índices en campos de búsqueda frecuente
- Particionar tabla `scan_logs` por fecha si crece mucho
- Implementar archivado de datos antiguos

### Seguridad
- Encriptar información sensible (email, phone)
- Usar prepared statements para prevenir SQL injection
- Implementar soft deletes en lugar de DELETE

### Backup
- Backup diario de todas las tablas
- Backup en tiempo real de `scans` durante eventos
- Retención de logs por al menos 1 año
