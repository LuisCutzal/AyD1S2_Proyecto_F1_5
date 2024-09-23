USE AYD_DataCenter;


-- TABLA DE ROLES
CREATE TABLE Roles (
    id_rol INT PRIMARY KEY IDENTITY(1,1),
    nombre_rol NVARCHAR(50) UNIQUE NOT NULL
);


-- Insertar roles predeterminados
INSERT INTO Roles (nombre_rol) VALUES ('Admin'), ('Empleado'), ('Cliente');


-- TABLA DE USUARIOS
CREATE TABLE Usuarios (
    id_usuario INT PRIMARY KEY IDENTITY(1,1),
    nombre NVARCHAR(100) NOT NULL,
    apellido NVARCHAR(100) NOT NULL,
    nombre_usuario NVARCHAR(50) UNIQUE NOT NULL,
    email NVARCHAR(100) UNIQUE NOT NULL,
    celular NVARCHAR(20),
    nacionalidad NVARCHAR(50),
    pais_residencia NVARCHAR(50),
    contrasena NVARCHAR(256) NOT NULL, -- Encriptada
    id_rol INT NOT NULL,
    espacio_asignado DECIMAL(10,2) DEFAULT 15.0, -- Espacio en GB
    espacio_ocupado DECIMAL(10,2) DEFAULT 0.0, -- Espacio usado por el usuario
    fecha_registro DATETIME DEFAULT GETDATE(),
    suscripcion_vencida BIT DEFAULT 0,
    FOREIGN KEY (id_rol) REFERENCES Roles(id_rol)
);


-- TABLA DE PLANES DE ALMACENAMIENTO
CREATE TABLE Planes_Almacenamiento (
    id_plan INT PRIMARY KEY IDENTITY(1,1),
    nombre_plan NVARCHAR(50) UNIQUE NOT NULL,
    espacio_total DECIMAL(10,2) NOT NULL, -- Espacio en GB
    duracion_meses INT NOT NULL, -- Duración del plan en meses
    costo DECIMAL(10,2) NOT NULL -- Costo del plan
);


-- TABLA DE CARPETAS
CREATE TABLE Carpetas (
    id_carpeta INT PRIMARY KEY IDENTITY(1,1),
    nombre_carpeta NVARCHAR(100) NOT NULL,
    id_usuario_propietario INT NOT NULL,
    id_carpeta_padre INT NULL,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    en_papelera BIT DEFAULT 0,
    FOREIGN KEY (id_usuario_propietario) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (id_carpeta_padre) REFERENCES Carpetas(id_carpeta)
);


-- TABLA DE ARCHIVOS
CREATE TABLE Archivos (
    id_archivo INT PRIMARY KEY IDENTITY(1,1),
    nombre_archivo NVARCHAR(255) NOT NULL,
    id_carpeta INT NULL,
    id_usuario_propietario INT NOT NULL,
    tamano_mb DECIMAL(10,2) NOT NULL, -- Tamaño en MB
    fecha_creacion DATETIME DEFAULT GETDATE(),
    fecha_modificacion DATETIME DEFAULT GETDATE(),
    en_papelera BIT DEFAULT 0,
    FOREIGN KEY (id_carpeta) REFERENCES Carpetas(id_carpeta),
    FOREIGN KEY (id_usuario_propietario) REFERENCES Usuarios(id_usuario)
);


-- TABLA DE ETIQUETAS
CREATE TABLE Etiquetas (
    id_etiqueta INT PRIMARY KEY IDENTITY(1,1),
    nombre_etiqueta NVARCHAR(100) NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
    UNIQUE (nombre_etiqueta, id_usuario) -- Evitar duplicados por usuario
);


-- TABLA DE RELACIÓN ENTRE ETIQUETAS Y ARCHIVOS/CARPETAS
CREATE TABLE Etiquetas_Relacion (
    id_etiqueta INT NOT NULL,
    id_archivo INT NULL,
    id_carpeta INT NULL,
    id_etiqueta_relacion INT PRIMARY KEY IDENTITY(1,1), -- Columna de clave primaria simple
    FOREIGN KEY (id_etiqueta) REFERENCES Etiquetas(id_etiqueta),
    FOREIGN KEY (id_archivo) REFERENCES Archivos(id_archivo),
    FOREIGN KEY (id_carpeta) REFERENCES Carpetas(id_carpeta),
    CONSTRAINT CK_Etiquetas_Relacion CHECK (
        (id_archivo IS NOT NULL AND id_carpeta IS NULL) OR
        (id_archivo IS NULL AND id_carpeta IS NOT NULL)
    )
);


-- TABLA DE FAVORITOS
CREATE TABLE Favoritos (
    id_favorito INT PRIMARY KEY IDENTITY(1,1),
    id_usuario INT NOT NULL,
    id_archivo INT NULL,
    id_carpeta INT NULL,
    fecha_agregado DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (id_archivo) REFERENCES Archivos(id_archivo),
    FOREIGN KEY (id_carpeta) REFERENCES Carpetas(id_carpeta),
    CONSTRAINT CK_Favoritos CHECK (
        (id_archivo IS NOT NULL AND id_carpeta IS NULL) OR
        (id_archivo IS NULL AND id_carpeta IS NOT NULL)
    )
);


-- TABLA DE ACTIVIDADES RECIENTES
CREATE TABLE Actividades_Recientes (
    id_actividad INT PRIMARY KEY IDENTITY(1,1),
    id_usuario INT NOT NULL,
    id_archivo INT NULL,
    id_carpeta INT NULL,
    tipo_actividad NVARCHAR(50) NOT NULL,
    fecha_actividad DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (id_archivo) REFERENCES Archivos(id_archivo),
    FOREIGN KEY (id_carpeta) REFERENCES Carpetas(id_carpeta)
);


-- TABLA DE BACKUPS CIFRADOS
CREATE TABLE Backups_Cifrados (
    id_backup INT PRIMARY KEY IDENTITY(1,1),
    id_usuario INT NOT NULL,
    id_archivo INT NOT NULL,
    id_carpeta INT NULL,
    nombre_backup NVARCHAR(255) NOT NULL,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    ruta_backup NVARCHAR(255) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (id_archivo) REFERENCES Archivos(id_archivo),
    FOREIGN KEY (id_carpeta) REFERENCES Carpetas(id_carpeta)
);


-- TABLA DE ARCHIVOS COMPARTIDOS
CREATE TABLE Compartidos (
    id_compartido INT PRIMARY KEY IDENTITY(1,1),
    id_usuario_propietario INT NOT NULL,
    id_usuario_destinatario INT NOT NULL,
    id_carpeta INT NULL,
    id_archivo INT NULL,
    fecha_comparticion DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (id_usuario_propietario) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (id_usuario_destinatario) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (id_carpeta) REFERENCES Carpetas(id_carpeta),
    FOREIGN KEY (id_archivo) REFERENCES Archivos(id_archivo),
    CONSTRAINT CK_Compartidos CHECK (
        (id_archivo IS NOT NULL AND id_carpeta IS NULL) OR
        (id_archivo IS NULL AND id_carpeta IS NOT NULL)
    )
);

CREATE TABLE SolicitudesEspacio (
    id_solicitud INT PRIMARY KEY IDENTITY(1,1),
    id_usuario INT,
    tipo_solicitud VARCHAR(10), -- 'expandir' o 'reducir'
    cantidad INT,
    estado VARCHAR(10) DEFAULT 'pendiente', -- 'pendiente', 'aprobada', 'rechazada'
    fecha_solicitud DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);

ALTER TABLE Usuarios
ADD fecha_ultimo_login DATETIME DEFAULT GETDATE();
ALTER TABLE Usuarios ADD fecha_fin_periodo_gratuito DATETIME;