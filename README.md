# sport-alarmist-web
Alerts — app web para gestionar torneos deportivos de barrio: inscripción de equipos, confirmación de asistencia a partidos y recordatorios de horarios, con maquetación fiel al diseño en Figma.

## Tabla de contenido

1. [Instalación y ejecución](#instalación-y-ejecución)
2. [Recomendaciones](#recomendaciones)
3. [Explicaciones de cambios](#explicaciones-de-cambios)
4. [Distribución de trabajo](#distribución-de-trabajo)

## Instalación y ejecución
### 1. Verificar instalación de Node.js
Asegúrese de tener Node.js instalado. Puede hacerlo en una terminal con el siguiente comando:

```bash
node -v
```

Si la respuesta no es el número de versión instalada, puede usar [esta guía](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) para instalar Node.js en su máquina.

> ⚠️ Recomendación: la aplicación fue desarrollada con las versiones v22.18.0 y v24.5.0. Si la versión que usted instaló le trae problemas para correr la aplicación, intente instalar alguna de estas versiones.

### 2. Descargar repositorio
Descargue el código fuente de este repositorio.

### 3. Abrir repositorio en una terminal
Abra una terminal y diríjase a la ubicación del repositorio instalado localmente. Puede hacer esto con el comando `cd`. Alternativamente, abra la carpeta del repositorio en un editor de código de su preferencia e inicie una terminal.

### 4. Instalar dependencias
Ejecute el siguiente comando para instalar las dependencias:

```bash
npm install
```

### 5. Iniciar aplicación
Una vez se hayan terminado de instalar, ejecute el siguiente comando para iniciar la aplicación:

```bash
ng serve
```

### 6. Abrir app en navegador
Listo! Diríjase a la ruta [localhost:4200](localhost:4200) en cualquier navegador y haga uso de la aplicación.

## Recomendaciones
Tenga en cuenta las siguientes recomendaciones al usar la aplicación:

- Se agregó la opción de borrar un equipo. Esto no cuenta con un modal de confirmación, así que tenga cuidado al darl click en el ícono de basura, porque si usted borra un equipo que pertenece a un partido, esto también eliminará el partido.

## Explicaciones de cambios

| # | Versión de mockup | Cambio | Justificación |
|---|-------------------|--------|---------------|
| 1 |<img width="2880" height="2048" alt="image" src="https://github.com/user-attachments/assets/e816d693-fa4b-4455-8716-8e90bd380cab" /> | <img width="1868" height="881" alt="image" src="https://github.com/user-attachments/assets/97269d46-54f6-4c04-89b8-c3d901d68e0d" />| Se ajusta la pantalla inicial, mejorando la presentación y habilitando el crear un torneo como foco principal para iniciar el flujo de interacción con el sistema. Esto alineado a las recomendaciones recibidas en las revisiones de mockups. |
| 2 | <img width="2880" height="2048" alt="image" src="https://github.com/user-attachments/assets/26e94f4f-b314-4492-b48c-7b9378b028c1" /> | <img width="1912" height="792" alt="image" src="https://github.com/user-attachments/assets/0c5de8f9-0506-4f93-a194-fe5b218b16ec" /> | Se ajusta la distribución de la información. Se separa el espacio del sidebar, del contenido, manteniendo el patrón maestro detalle, pero distribuyendo el título del contenido y la opçión de agregar torneo en el espacio principal de la vista. Esto también alineado a las recomendaciones recibidas en las revisiones de mockups.  |
| 3 | <img width="512" height="560" alt="image" src="https://github.com/user-attachments/assets/60f61e2c-dc7a-4df1-8dd1-fe63cf41a577" /> | <img width="325" height="423" alt="image" src="https://github.com/user-attachments/assets/cfaac385-1619-4e9c-832c-365c7924b641" /> | El calendario usado es de Material Design 3, igual que en los mockups, pero vino en diferente presentación. Los colores no pudieron asimilarse a la versión original por las restricciones de cambio de diseño del componente. |
| 4 | <img width="577" height="124" alt="image" src="https://github.com/user-attachments/assets/ab6888ce-4040-428b-86fe-d41d5c6061fa" /> |  <img width="1493" height="167" alt="image" src="https://github.com/user-attachments/assets/c252acfc-4050-471d-b4a4-5856efa9b5ff" /> | Se agregan doodles, como detalles decorativos que se ajustan conforme se avanza en un proceso, acorde a las recomendaciones de usar el principio de diseño de capas expuesto en móvil, llevándolo también a web. |
| 5 | <img width="663" height="365" alt="image" src="https://github.com/user-attachments/assets/ff0accfa-1885-42cc-8b28-10e06e9314cd" /> |  <img width="272" height="313" alt="image" src="https://github.com/user-attachments/assets/90698fb2-5f02-4f94-8b47-8aa6862ee2eb" /> | Similar a calendario, los inputs de Material Design 3 eran reacios a cambios, por lo que la presentación no pudo quedar exactamente igual. |
| 6 |  <img width="933" height="104" alt="image" src="https://github.com/user-attachments/assets/fe7b9c83-d3af-4ba8-a0bf-c435b9f28a5e" />| <img width="1269" height="145" alt="image" src="https://github.com/user-attachments/assets/e09b0aa6-cfc1-4d94-8e1c-411632ef2098" /> | Se ajustan los inputs de texto para que tengan una línea que resalta que el campo está seleccionado. Esto vuelve el formulario más usable. |
| 7 | <img width="233" height="178" alt="image" src="https://github.com/user-attachments/assets/742d1a2f-5fd0-4841-a731-a08744b3081f" /> |  <img width="304" height="310" alt="image" src="https://github.com/user-attachments/assets/df732874-1f5f-4582-b46a-cb39a282e8a8" /> | Se ajusta para diferenciar las opciones de los botones, acorde a recomendaciones recibidas. |
| 8 | <img width="416" height="230" alt="image" src="https://github.com/user-attachments/assets/87ce8147-8bed-46b8-be6e-1e32a3041b19" /> | <img width="211" height="98" alt="image" src="https://github.com/user-attachments/assets/999813c0-02fc-4c69-b7dd-fb5288f446ca" />| Se cambia el color de la caja de información a uno que contraste con el fondo y sea más amigable a la vista. |
| 9 | N/A | <img width="384" height="147" alt="image" src="https://github.com/user-attachments/assets/16df13a4-2a55-4e68-9443-6f962519661c" /> | Se añade la opción de borrar un equipo. Agrega valor al usuario porque no hay una opción de editar implementada, así que de este modo puede corregir algún error cometido.

## Distribución de trabajo
Para ver detalladamente qué cambios hizo cada integrante, puede dirijirse al apartado de [Pull Requests](https://github.com/jech57/sport-alarmist-web/pulls?q=is%3Apr+state%3Aclosed). Allí también podrá encontrar fotos de los modificaciones que fueron siendo agregadas. Además, debajo puede encontrar el listado de las pantallas que desarrolló cada uno.

### 👩‍💻 Laura
- Agregar torneo
- Ver partidos
- Agregar fecha
- Editar fecha
- Agregar partido
- Editar partido

### 👨‍💻 Javier
- Pantalla inicial
- Ver equipos
- Borrar equipo
- Borrar partido
- Borrar fecha
- Ajustes
