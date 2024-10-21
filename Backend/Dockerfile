# Usa una imagen base estable de Python
FROM python:3.12-slim

# Instala las dependencias necesarias para pyodbc y SQL Server
RUN apt-get update && apt-get install -y \
    build-essential \
    unixodbc-dev \
    unixodbc \
    libssl3 \
    curl \
    && curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
    && curl https://packages.microsoft.com/config/debian/10/prod.list > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y msodbcsql17

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el archivo de dependencias al contenedor
COPY requirements.txt .

# Instala las dependencias Python necesarias
RUN pip install --no-cache-dir --user -r requirements.txt

# Copia el resto del código de la aplicación al contenedor
COPY . .

# Expone el puerto en el que la aplicación correrá
EXPOSE 5000

# Define el comando por defecto para ejecutar la aplicación
CMD ["python", "app.py"]
