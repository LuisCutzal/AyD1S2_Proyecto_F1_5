# ID Encargado

| ID  | Nombre                       |
| --- | ---------------------------- |
| 1   | Luis Antonio Cutzal Chalí    |
| 2   | Pedro Martín Francisco       |
| 3   | Víctor Ronaldo Gómez Lara    |

# Product Backlog Inicial

## Épica 1: Registro e Inicio de Sesión
- **Historia de Usuario 1**: Como Cliente, quiero registrarme en el sistema para poder almacenar mis archivos.
  - **Tareas**:
    - Crear formulario de registro.
    - Validar campos (email, nombre de usuario).
    - Encriptar contraseña.
    - Enviar correo de confirmación.

- **Historia de Usuario 2**: Como Cliente, quiero iniciar sesión para acceder a mi cuenta.
  - **Tareas**:
    - Crear formulario de inicio de sesión.
    - Implementar opción "olvidé contraseña".

## Épica 2: Gestión de Usuarios Administrativos
- **Historia de Usuario 3**: Como Administrador, quiero crear usuarios tipo Empleado y Cliente para gestionar el sistema.
  - **Tareas**:
    - Crear formulario para crear usuarios.
    - Enviar notificaciones por correo.

- **Historia de Usuario 4**: Como Administrador, quiero modificar configuraciones de cuentas para gestionar el almacenamiento.
  - **Tareas**:
    - Implementar funcionalidad para aumentar/reducir espacio.
    - Validar restricciones en la reducción del espacio.

- **Historia de Usuario 5**: Como Administrador, quiero eliminar cuentas de usuario para mantener el sistema limpio.
  - **Tareas**:
    - Implementar opción de eliminación de cuenta.
    - Enviar aviso de eliminación por correo.

## Épica 3: Gestión de Archivos y Carpetas para Clientes
- **Historia de Usuario 6**: Como Cliente, quiero gestionar mis archivos para mantener mi almacenamiento organizado.
  - **Tareas**:
    - Implementar creación, modificación y eliminación de carpetas.
    - Implementar subir, descargar, eliminar y modificar archivos.

- **Historia de Usuario 7**: Como Cliente, quiero ver un gráfico de mi espacio ocupado para conocer mi uso de almacenamiento.
  - **Tareas**:
    - Crear gráfica para mostrar espacio utilizado.

- **Historia de Usuario 8**: Como Cliente, quiero vaciar la papelera para liberar espacio de manera irreversible.
  - **Tareas**:
    - Implementar opción para vaciar papelera.

- **Historia de Usuario 9**: Como Cliente, quiero compartir carpetas y archivos con otros usuarios.
  - **Tareas**:
    - Implementar opción para compartir por correo o nombre de usuario.
    - Crear carpeta "Compartidos Conmigo" que se muestre al recibir archivos.
    - Mostrar el propietario de cada archivo o carpeta.
    - Permitir al propietario modificar o eliminar sus archivos/carpetas.
    - Permitir dejar de compartir una carpeta.
    - Etiquetar archivos/carpetas que están siendo compartidos.

- **Historia de Usuario 10**: Como Cliente, quiero agregar tags personalizados a mis carpetas para identificar contenido.
  - **Tareas**:
    - Implementar funcionalidad para agregar y gestionar tags.

- **Historia de Usuario 11**: Como Cliente, quiero conocer los detalles de cada carpeta o archivo (fecha de creación, última modificación, espacio ocupado).
  - **Tareas**:
    - Mostrar detalles en la interfaz de usuario.

- **Historia de Usuario 12**: Como Cliente, quiero tener acceso a una pestaña de archivos y carpetas recientes.
  - **Tareas**:
    - Implementar sección para mostrar elementos recientes.

- **Historia de Usuario 13**: Como Cliente, quiero previsualizar archivos (PDF, imágenes, música, videos).
  - **Tareas**:
    - Implementar visualizadores para diferentes tipos de archivos.

- **Historia de Usuario 14**: Como Cliente, quiero agregar archivos y carpetas a una lista de favoritos.
  - **Tareas**:
    - Implementar funcionalidad para marcar como favorito.

- **Historia de Usuario 15**: Como Cliente, quiero crear un backup cifrado de mis archivos.
  - **Tareas**:
    - Implementar opción para crear backups cifrados.

## Épica 4: Gestión de Perfiles de Usuario
- **Historia de Usuario 16**: Como Cliente, quiero modificar mis datos de perfil para mantener mi información actualizada.
  - **Tareas**:
    - Crear formulario de edición de perfil.

- **Historia de Usuario 17**: Como Cliente, quiero solicitar expansión o reducción de espacio en mi cuenta para gestionar mis necesidades de almacenamiento.
  - **Tareas**:
    - Implementar opción de solicitud de cambio de espacio.

- **Historia de Usuario 18**: Como Cliente, quiero solicitar eliminación de mi cuenta de manera irreversible para manejar mi información personal.
  - **Tareas**:
    - Implementar opción de eliminación de cuenta.
    - Enviar confirmación por correo.

## Consideraciones para el Frontend y Backend
- **Frontend**:
  - Diseño de interfaces de usuario (UI) para cada funcionalidad.
  - Integración de formularios y validaciones.
  - Gráficos y visualizaciones de uso de almacenamiento.
  - Implementación de previsualización de archivos y gestión de favoritos.

- **Backend**:
  - API para gestionar la creación y eliminación de usuarios.
  - Lógica para el manejo de archivos y carpetas.
  - Implementar lógica para compartir archivos.
  - Autenticación y autorización de usuarios.
  - Envío de correos electrónicos.


## Primer Sprint
Enlace para video de sprint planning
https://youtube.com/live/gT9IaJVRj4A

### Sprint 1 Backlog

| ID  | Módulo        | Tarea                                          | Encargado     |
| --- | ------------- | ---------------------------------------------- | -------------- |
| 1   | DOCUMENTACION | Descripción de la metodología de desarrollo a utilizar y su justificación | 1              |
| 2   | DOCUMENTACION | Descripción del modelo de branching a utilizar | 3              |
| 3   | DOCUMENTACION | Toma de requerimientos funcionales             | 2              |
| 4   | DOCUMENTACION | Toma de requerimientos no funcionales          | 2              |
| 5   | DOCUMENTACION | Descripción de las tecnologías a utilizar      | 3              |
| 6   | DOCUMENTACION | Diagramas de actividades                       | 1              |
| 7   | DOCUMENTACION | Arquitectura de sistemas                       | 3              |
| 8   | DOCUMENTACION | Diagrama de despliegue                         | 1              |
| 9   | DOCUMENTACION | Modelo Entidad Relación                        | 1              |
| 10  | DOCUMENTACION | Mockups de las principales vistas para la página web | 2 y 3       |
| 11  | DOCUMENTACION | Documentación de las Pipelines                 | 1 y 3          |

## Daily Scrum 1

### Participantes:

- **Luis Antonio Cutzal Chalí** (ID 1)

  - **Qué hizo ayer**: Ayer trabajé en la metodología de desarrollo y su justificación. Fue interesante reflexionar sobre por qué elegimos este enfoque.
  - **Qué hará hoy**: Hoy continuaré con el diagrama de despliegue, buscando visualizar claramente cómo se interconectan los componentes.
  - **Impedimentos**: Ninguno por ahora, todo fluye bien.

- **Pedro Martín Francisco** (ID 2)

  - **Qué hizo ayer**: Comencé con la toma de requerimientos funcionales. Hice algunas entrevistas y recopilé información valiosa.
  - **Qué hará hoy**: Hoy seguiré con la toma de requerimientos no funcionales, quiero asegurarme de cubrir todos los aspectos.
  - **Impedimentos**: Ninguno, todo en orden.

- **Víctor Ronaldo Gómez Lara** (ID 3)

  - **Qué hizo ayer**: Empecé a describir el modelo de branching a utilizar. Me gusta cómo se está configurando.
  - **Qué hará hoy**: Hoy continuaré con la descripción de las tecnologías que vamos a usar, espero tener un panorama claro al final del día.
  - **Impedimentos**: Ninguno, el equipo está colaborando bien.

---

## Daily Scrum 2

### Participantes:

- **Luis Antonio Cutzal Chalí** (ID 1)

  - **Qué hizo ayer**: Trabajé en el diagrama de despliegue y creo que capturé bastante bien cómo se organizarán los elementos.
  - **Qué hará hoy**: Continuaré con el diagrama de actividades, quiero asegurarme de que refleje todos los procesos.
  - **Impedimentos**: Ninguno, todo avanza sin problemas.

- **Pedro Martín Francisco** (ID 2)

  - **Qué hizo ayer**: Empecé con la toma de requerimientos no funcionales y he recopilado información relevante sobre el rendimiento.
  - **Qué hará hoy**: Hoy me enfocaré en los mockups de las principales vistas para la página web, quiero que el diseño sea intuitivo.
  - **Impedimentos**: Ninguno, tengo todo lo que necesito por ahora.

- **Víctor Ronaldo Gómez Lara** (ID 3)

  - **Qué hizo ayer**: Continué con la descripción de las tecnologías a utilizar y estoy emocionado con las opciones que estamos considerando.
  - **Qué hará hoy**: Hoy avanzaré en la arquitectura de sistemas, necesito que todo esté bien alineado.
  - **Impedimentos**: Ninguno, el trabajo en equipo es excelente.

---

## Daily Scrum 3

### Participantes:

- **Luis Antonio Cutzal Chalí** (ID 1)

  - **Qué hizo ayer**: Trabajé en el diagrama de actividades y creo que he identificado algunos flujos clave que necesitamos tener en cuenta.
  - **Qué hará hoy**: Seguiré trabajando en el diagrama de actividades para perfeccionarlo.
  - **Impedimentos**: Ninguno, todo sigue en marcha.

- **Pedro Martín Francisco** (ID 2)

  - **Qué hizo ayer**: Continué con los mockups de las vistas y me gusta cómo están tomando forma. Quiero recibir feedback pronto.
  - **Qué hará hoy**: Hoy seguiré avanzando con los mockups, refinando detalles visuales.
  - **Impedimentos**: Ninguno, tengo buen material para trabajar.

- **Víctor Ronaldo Gómez Lara** (ID 3)

  - **Qué hizo ayer**: Continué con los mockups de las vistas y me aseguré de que se alinearan con los requerimientos.
  - **Qué hará hoy**: Hoy me enfocaré en completar los mockups y prepararlos para revisión.
  - **Impedimentos**: Ninguno, el proceso es fluido.

---

### Sprint 2 Backlog

| ID  | Módulo   | Tarea                                          | Encargado |
| --- | -------- | ---------------------------------------------- | --------- |
| 1   | BACKEND  | Login por Roles                                | 1         |
| 2   | FRONTEND | Vistas Autenticación                          | 2         |
| 3   | BACKEND  | Reset Contraseña                              | 1         |
| 4   | BACKEND  | Registro Usuario                              | 1         |
| 5   | CLOUD    | Base de datos en AWS                          | 1         |
| 6   | FRONTEND | Maquetación                                   | 2         |
| 7   | FRONTEND | Vista del Usuario                             | 2         |
| 8   | FRONTEND | Autenticación: Integración de Registro Usuario | 2         |

---

## Daily Scrum 1

### Participantes:

- **Luis Antonio Cutzal Chalí** (ID 1)

  - **Qué hizo ayer**: Ayer trabajé en las funciones del BACKEND, específicamente en el login por roles. Me sentí bien con el avance, aunque encontré algunos desafíos.
  - **Qué hará hoy**: Hoy continuaré con las funciones del BACKEND, enfocándome en el reset de contraseña.
  - **Impedimentos**: He tenido dificultades para entender la lógica de roles. Me gustaría discutirlo con el equipo para aclarar algunos puntos.

- **Pedro Martín Francisco** (ID 2)

  - **Qué hizo ayer**: Ayer me concentré en la maquetación de las vistas de autenticación. Estoy contento con el diseño hasta ahora.
  - **Qué hará hoy**: Hoy planeo avanzar en las vistas de autenticación, asegurándome de que sean intuitivas y atractivas.
  - **Impedimentos**: No tengo impedimentos, pero me gustaría recibir retroalimentación sobre la maquetación que hice.

---

## Daily Scrum 2

### Participantes:

- **Luis Antonio Cutzal Chalí** (ID 1)

  - **Qué hizo ayer**: Continué con la función de reset de contraseña, pero he encontrado algunos bugs que me retrasaron un poco.
  - **Qué hará hoy**: Hoy quiero terminar el registro de usuarios. Quiero que todo esté listo para la integración.
  - **Impedimentos**: Estoy teniendo problemas con la identificación por roles. No estoy seguro si la lógica que implementé es la correcta.

- **Pedro Martín Francisco** (ID 2)

  - **Qué hizo ayer**: Seguí trabajando en las vistas de autenticación. Hice algunos ajustes basados en el feedback que recibí.
  - **Qué hará hoy**: Hoy voy a revisar las vistas del usuario y asegurarme de que sean coherentes con el resto del diseño.
  - **Impedimentos**: No tengo impedimentos, pero me gustaría más claridad sobre los requisitos de las vistas.

---

## Daily Scrum 3

### Participantes:

- **Luis Antonio Cutzal Chalí** (ID 1)

  - **Qué hizo ayer**: Finalmente, terminé la implementación del registro de usuarios. Fue un reto, pero valió la pena.
  - **Qué hará hoy**: Hoy planeo revisar la base de datos en AWS para asegurarme de que todo esté correctamente configurado.
  - **Impedimentos**: No tengo impedimentos específicos, aunque sigo teniendo dudas sobre algunos datos en la base.

- **Pedro Martín Francisco** (ID 2)

  - **Qué hizo ayer**: Realicé las vistas del usuario y estoy satisfecho con cómo se ven. Creo que ofrecen una buena experiencia.
  - **Qué hará hoy**: Continuaré con la autenticación: la integración del registro de usuarios. Quiero que todo funcione sin problemas.
  - **Impedimentos**: Me estoy topando con algunos problemas técnicos en la integración que necesitan más tiempo para solucionarse.

---

## Daily Scrum 4

### Participantes:

- **Luis Antonio Cutzal Chalí** (ID 1)

  - **Qué hizo ayer**: Revisé la base de datos en AWS y encontré algunas inconsistencias que debemos abordar.
  - **Qué hará hoy**: Trabajaré en corregir esas inconsistencias y finalizaré la lógica de login por roles.
  - **Impedimentos**: Estoy teniendo dificultades con la documentación de AWS; necesito un poco más de ayuda.

- **Pedro Martín Francisco** (ID 2)

  - **Qué hizo ayer**: Terminé de revisar las vistas del usuario y las integré con la lógica de autenticación.
  - **Qué hará hoy**: Hoy me enfocaré en la maquetación del registro de usuario, asegurándome de que sea fluida.
  - **Impedimentos**: Algunos elementos de diseño no se están mostrando correctamente en los diferentes navegadores.

---

## Daily Scrum 5

### Participantes:

- **Luis Antonio Cutzal Chalí** (ID 1)

  - **Qué hizo ayer**: Corregí las inconsistencias en la base de datos y completé la lógica del login por roles. Siento que todo está encajando.
  - **Qué hará hoy**: Hoy quiero hacer pruebas exhaustivas del sistema para asegurarme de que todo funcione.
  - **Impedimentos**: Algunos errores en la integración con el frontend me están deteniendo un poco.

- **Pedro Martín Francisco** (ID 2)

  - **Qué hizo ayer**: Trabajé en la maquetación del registro de usuario y creo que está quedando bien.
  - **Qué hará hoy**: Hoy seguiré con la integración de la autenticación y realizaré pruebas de usabilidad.
  - **Impedimentos**: He encontrado un par de problemas con el CSS que necesito resolver antes de avanzar.

---

## Daily Scrum 6

### Participantes:

- **Luis Antonio Cutzal Chalí** (ID 1)

  - **Qué hizo ayer**: Realicé pruebas del sistema y encontré algunos errores menores en la lógica de autenticación.
  - **Qué hará hoy**: Hoy voy a corregir esos errores y asegurarme de que el login por roles funcione sin problemas.
  - **Impedimentos**: Necesito más información sobre las expectativas del cliente en cuanto al flujo de usuario.

- **Pedro Martín Francisco** (ID 2)

  - **Qué hizo ayer**: Terminé de resolver los problemas de CSS en la maquetación. Ahora se ve mucho mejor.
  - **Qué hará hoy**: Hoy me enfocaré en las pruebas de la integración de registro de usuario y autenticarlo con el backend.
  - **Impedimentos**: Algunos cambios en el backend me están generando confusión en la integración.

---

## Daily Scrum 7

### Participantes:

- **Luis Antonio Cutzal Chalí** (ID 1)

  - **Qué hizo ayer**: Corregí los errores de autenticación y realicé pruebas exhaustivas. La función ahora parece estable.
  - **Qué hará hoy**: Hoy quiero enfocarme en documentar lo que hemos hecho para tener un registro claro del progreso.
  - **Impedimentos**: Todavía tengo dudas sobre ciertos requisitos de funcionalidad. Un poco más de claridad sería útil.

- **Pedro Martín Francisco** (ID 2)

  - **Qué hizo ayer**: Terminé las pruebas de la integración de registro de usuario. Todo funcionó como se esperaba, lo cual es un alivio.
  - **Qué hará hoy**: Hoy me dedicaré a preparar una presentación sobre lo que hemos logrado hasta ahora.
  - **Impedimentos**: No tengo impedimentos, pero estoy buscando feedback sobre la presentación para asegurarme de que sea efectiva.

---




## Segundo Sprint
Enlace para video de sprint planning
https://drive.google.com/file/d/1e_uqSPW32RH5z-StzrKfuiSiR8DE-QhP/view?usp=sharing

Retroalimentacion:
https://drive.google.com/file/d/1U-WuGxl3FpZrSyn-_BmCUWUUD_B6pyPN/view?usp=sharing

### Sprint 2 Backlog

| ID  | Módulo | Tarea                                        | Encargado |
| --- | ------ | -------------------------------------------- | --------- |
| 11  | BACKEND   | Eliminar cuentas                                             | 1         |
| 12  | BACKEND   | Crear - eliminar - modificar carpetas                        | 1         |
| 13  | BACKEND   | Subir - descargar - eliminar - modificar archivos.           | 1         |
| 14  | BACKEND   | Crear papelera                                               | 1         |
| 15  | BACKEND   | Modificar sus datos del perfil                               | 1         |
| 16  | BACKEND   | Solicitar expansión o reducción de espacio en su cuenta      | 1         |
| 17  | BACKEND   | Solicitar eliminación de su cuenta                           | 1         |
| 18  | FRONTEND  | Vista del administrador                                      | 2         |
| 19  | FRONTEND  | Administrador: Integración eliminar cuentas                  | 2         |
| 20  | FRONTEND  | Administrador: Integración ver solicitudes                   | 2         |
| 21  | FRONTEND  | Administrador: Integración modificar cuentas                 | 2         |
| 22  | FRONTEND  | Usuario: Integración dashboard                               | 2         |
| 23  | FRONTEND  | Usuario: Integración CRUD archivos y carpetas                | 2         |
| 24  | FRONTEND  | Usuario: Integración modificar datos perfil                  | 2         |
| 25  | FRONTEND  | Usuario: Integración solicitar cambio de espacio en la cuenta| 2         |

## Daily Scrum 1

### Participantes:

- **Luis Antonio Cutzal Chalí** (ID 1)

  - **Qué hizo ayer**: Ayer completé la tarea de eliminar cuentas en el backend. Fue un proceso complicado, pero revisé todas las dependencias para asegurarme de que no hubiera problemas.
  - **Qué hará hoy**: Hoy planeo empezar con la creación y eliminación de carpetas. Quiero revisar la estructura actual para definir cómo podemos optimizarla.
  - **Impedimentos**: Estoy encontrando algunas dificultades con las dependencias en la base de datos. Esto está retrasando mi avance, ya que necesito asegurarme de que todo esté limpio antes de seguir.

- **Pedro Martín Francisco** (ID 2)

  - **Qué hizo ayer**: Desarrollé la vista del administrador en el frontend. Me aseguré de que las interacciones sean intuitivas y fáciles de usar, aunque hubo algunos detalles que tuvieron que ajustarse.
  - **Qué hará hoy**: Hoy me enfocaré en integrar la funcionalidad de eliminar cuentas para el administrador. Esto incluirá tanto la interfaz como la conexión con el backend.
  - **Impedimentos**: Estoy teniendo problemas para sincronizar la vista con la lógica del backend. Algunas funciones no están alineadas, lo que complica la integración.

---

## Daily Scrum 2

### Participantes:

- **Luis Antonio Cutzal Chalí** (ID 1)

  - **Qué hizo ayer**: Completé la creación y eliminación de carpetas. Me aseguré de que los permisos se manejaran correctamente, aunque fue un proceso engorroso.
  - **Qué hará hoy**: Hoy quiero concentrarme en la funcionalidad para subir, descargar y eliminar archivos, priorizando la seguridad de las operaciones.
  - **Impedimentos**: Algunas funciones de archivos están tomando más tiempo del que esperaba, especialmente al gestionar las rutas y las validaciones.

- **Pedro Martín Francisco** (ID 2)

  - **Qué hizo ayer**: Integré la funcionalidad de eliminar cuentas en el administrador. Sin embargo, encontré errores en la validación que me dieron bastante guerra.
  - **Qué hará hoy**: Continuaré con la integración para ver solicitudes en el administrador y tratar de solucionar esos errores de validación que surgieron.
  - **Impedimentos**: La documentación del backend no es tan clara como debería. He perdido tiempo tratando de entender ciertas partes, y eso me está ralentizando.

---

## Daily Scrum 3

### Participantes:

- **Luis Antonio Cutzal Chalí** (ID 1)

  - **Qué hizo ayer**: Implementé la funcionalidad para subir y descargar archivos, pero algunos métodos no están funcionando como esperábamos. He estado revisando el código para identificar los errores.
  - **Qué hará hoy**: Hoy empezaré a trabajar en la creación de la papelera. Quiero asegurarme de que se manejen adecuadamente los archivos eliminados y su posible recuperación.
  - **Impedimentos**: Encontré un error crítico al intentar descargar archivos. He estado dedicando más tiempo del esperado a investigar y solucionarlo.

- **Pedro Martín Francisco** (ID 2)

  - **Qué hizo ayer**: Finalicé la integración para ver solicitudes en el administrador, pero las pruebas mostraron algunos problemas de rendimiento que debo abordar.
  - **Qué hará hoy**: Me enfocaré en integrar la funcionalidad para modificar cuentas en el administrador y optimizar la carga de solicitudes.
  - **Impedimentos**: Estoy luchando con la consulta de datos, que está siendo más lenta de lo que pensaba, y eso afecta la experiencia del usuario.

---

## Daily Scrum 4

### Participantes:

- **Luis Antonio Cutzal Chalí** (ID 1)

  - **Qué hizo ayer**: Trabajé en la creación de la papelera, diseñando cómo se manejarán los archivos eliminados y cómo se podrán recuperar.
  - **Qué hará hoy**: Quiero completar la implementación de la papelera y ponerla a prueba para asegurarme de que funcione correctamente.
  - **Impedimentos**: He encontrado problemas con la gestión de archivos que no se eliminan correctamente de la base de datos, lo que ha sido frustrante.

- **Pedro Martín Francisco** (ID 2)

  - **Qué hizo ayer**: Completé la integración para modificar cuentas en el administrador, pero aún no he podido hacer pruebas exhaustivas para verificar que todo funcione bien.
  - **Qué hará hoy**: Hoy planeo integrar la funcionalidad de solicitar un cambio de espacio en la cuenta y verificar que se comunique correctamente con el backend.
  - **Impedimentos**: La API está teniendo problemas intermitentes que dificultan la conexión con las funciones que necesito, y eso me está retrasando.

---

## Daily Scrum 5

### Participantes:

- **Luis Antonio Cutzal Chalí** (ID 1)

  - **Qué hizo ayer**: Terminé la implementación de la papelera, pero no he podido probarla tan bien como quisiera. Necesito asegurarme de que todos los escenarios estén cubiertos.
  - **Qué hará hoy**: Planeo poner a prueba la funcionalidad de la papelera, asegurándome de que los archivos se eliminen y recuperen correctamente.
  - **Impedimentos**: Algunas pruebas están llevando más tiempo debido a errores que surgen durante la recuperación de archivos. Me gustaría tener más tiempo para depurar.

- **Pedro Martín Francisco** (ID 2)

  - **Qué hizo ayer**: Comencé la integración para solicitar un cambio de espacio en la cuenta, pero he tenido algunas dificultades técnicas con la validación.
  - **Qué hará hoy**: Quiero continuar con la integración y hacer pruebas de la funcionalidad, buscando resolver problemas de comunicación con el backend.
  - **Impedimentos**: La falta de ejemplos claros en la documentación me está causando confusión en cómo implementar algunas funciones.

---

## Daily Scrum 6

### Participantes:

- **Luis Antonio Cutzal Chalí** (ID 1)

  - **Qué hizo ayer**: Probé la funcionalidad de la papelera y realicé algunos ajustes menores en la lógica de recuperación para mejorar el rendimiento.
  - **Qué hará hoy**: Iniciaré la tarea de modificar datos del perfil del usuario, asegurándome de que todas las validaciones sean sólidas y fáciles de usar.
  - **Impedimentos**: He encontrado algunos casos de prueba que no se manejan correctamente, lo que me está retrasando y frustrando un poco.

- **Pedro Martín Francisco** (ID 2)

  - **Qué hizo ayer**: Integré y probé la funcionalidad de solicitar un cambio de espacio, pero los resultados fueron mixtos y debo hacer más ajustes.
  - **Qué hará hoy**: Quiero finalizar las pruebas y documentar el proceso para que todo quede claro y fácil de entender.
  - **Impedimentos**: Algunos datos de prueba están generando errores inesperados, lo que complica las pruebas finales y me hace perder tiempo.

---

## Daily Scrum 7

### Participantes:

- **Luis Antonio Cutzal Chalí** (ID 1)

  - **Qué hizo ayer**: Completé la modificación de datos del perfil del usuario, pero algunos casos no están funcionando como esperaba y debo revisarlos.
  - **Qué hará hoy**: Quiero revisar el código y corregir los errores que han surgido en las pruebas para asegurar que todo funcione bien antes de la presentación.
  - **Impedimentos**: Las pruebas de integración han revelado inconsistencias en los datos, lo que está retrasando un poco mi trabajo y complicando la situación.

- **Pedro Martín Francisco** (ID 2)

  - **Qué hizo ayer**: Terminé la documentación del proceso de solicitud de cambio de espacio, pero tuve que hacer varias revisiones para que quedara claro.
  - **Qué hará hoy**: Preparar la vista final del administrador y corregir posibles errores que han surgido durante la documentación. Quiero que todo esté listo para la revisión.
  - **Impedimentos**: La revisión del diseño está tomando más tiempo del que pensaba debido a algunos comentarios de última hora sobre la usabilidad.

---

## Daily Scrum 8

### Participantes:

- **Luis Antonio Cutzal Chalí** (ID 1)

  - **Qué hizo ayer**: Revisé el código y corregí varios errores que estaban afectando la modificación del perfil. Ahora está funcionando mucho mejor.
  - **Qué hará hoy**: Voy a enfocarme en realizar pruebas finales para asegurarme de que todo el sistema funcione bien y esté libre de errores.
  - **Impedimentos**: Todavía hay algunas funciones que no se comportan como deberían, y esto me ha llevado más tiempo del que esperaba.

- **Pedro Martín Francisco** (ID 2)

  - **Qué hizo ayer**: Hice las correcciones necesarias en la vista final del administrador y ahora se ve bastante bien. También documenté los cambios realizados.
  - **Qué hará hoy**: Me centraré en las pruebas finales de la interfaz del administrador y en asegurarme de que todo esté listo para la entrega.
  - **Impedimentos**: Estoy un poco estancado con algunos detalles menores de la interfaz que no se alinean perfectamente con lo que quería, y eso me está retrasando.

---

## Daily Scrum 9

### Participantes:

- **Luis Antonio Cutzal Chalí** (ID 1)

  - **Qué hizo ayer**: Realicé pruebas exhaustivas y corregí varios errores. Ahora la modificación del perfil funciona a la perfección.
  - **Qué hará hoy**: Haré una revisión final de la papelera para asegurarme de que los archivos se eliminen y recuperen sin problemas.
  - **Impedimentos**: Algunos errores menores siguen apareciendo durante las pruebas, lo que ha hecho que el proceso sea más lento de lo que esperaba.

- **Pedro Martín Francisco** (ID 2)

  - **Qué hizo ayer**: Realicé pruebas en la interfaz del administrador y documenté los hallazgos. Todo está fluyendo bastante bien.
  - **Qué hará hoy**: Hoy terminaré las pruebas y haré los ajustes finales antes de la entrega. Quiero que todo esté perfecto.
  - **Impedimentos**: Estoy lidiando con pequeños bugs que, aunque son menores, están consumiendo más tiempo del que anticipé.

