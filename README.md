<div align="center">
 <a href="https://discord.gg/MBPsvcphGf" target="_blank"><img src="https://img.shields.io/maintenance/yes/2023?style=for-the-badge&label=MANTENIDO" /></a>
 <a href="https://discord.gg/MBPsvcphGf" target="_blank"><img src="https://img.shields.io/discord/879397504075063297?color=blue&label=soporte&style=for-the-badge&logoColor=white" /></a>
 <a href="https://www.postgresql.org" target="_blank"><img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white"/></a>
 <a href="https://www.nodejs.org" target="_blank"><img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white"/></a>
</div>

# Bot Comunidad V14 

> 👤 *Creado por **`[Nica]`***

> <img src="https://cdn.discordapp.com/emojis/1046290355471011880.png" width="16" style="border-radius: 50%;"></img> [Nicaina Team](https://discord.gg/XhRMnh3KXZ)

# 📋 Tabla de Contenidos

- [Bot Comunidad V14](#bot-comunidad-v14)
- [📋 Tabla de Contenidos](#-tabla-de-contenidos)
  - [✍ Configuración](#-configuración)
    - [☑️ Requisitos](#️-requisitos)
    - [📋 Instalación](#-instalación)
    - [⚙️ Configuración](#️-configuración)
    - [🔨 Creación de Comandos](#-creación-de-comandos)
      - [(/) Comandos Slash](#-comandos-slash)
  - [💪 Características](#-características)
  - [❤ Donaciones](#-donaciones)
  - [🔰 Soporte](#-soporte)

## ✍ Configuración
### ☑️ Requisitos
- Crear un bot en el [Portal de Developers de Discord](https://discord.com/developers/applications) y activarle los intentos de: Contenido de Mensaje, Miembros de Servidores y Presencia.
- Tener [NodeJS](https://nodejs.org) instalado en el equipo.
- Se recomienda instalar la versión LTS `16.x.x` para evitar posibles errores (yo utilizo 18.x.x).
- Un [cluster de MongoDB](https://www.mongodb.com/es/cloud/atlas/) para conectar la base de datos.
- Es recomendable hostearlo en un VPS para tener tu bot activo 24/7.

### 📋 Instalación
```git
git clone https://github.com/Nica85/bot_comunidad
npm install
```

### ⚙️ Configuración
En la carpeta botconfig rellena los archivos `.env`, o config.json con los datos de tu bot servidor y owner para que el bot funcione.

*⚠️ Nunca compartas el contenido de tu `config.json` o `.env` con nadie*

```
Ejemplo:

token = "token del bot"
mongodburi = "url mongodb"
ownerid = "id del dueño"
servidorid = "servidor id principal"
invitación = "invitación del bot"
```

Cuando tengas el bot configurado y con sus módulos instalados, puedes iniciarlo usando ```node .```

### 🔨 Creación de Comandos
#### 💬 Comandos Slash
En `/comandos`, podrás encontrar las categorías de los comandos, para crear una categoría, es tan sencillo como crear una carpeta dentro de esta ruta, por ejemplo:

- `/comandos/pruebas`

Para crear comandos dentro de esta categoría, tendrás que crear un archivo con el nombre del comando con formato `.js`, por ejemplo:

- `/comandos/pruebas/ping.js`

Después, tendrás que crear la estructura del comando con la siguiente plantilla:

```js
const {ChatInputCommandInteraction, Client} = require("discord.js");

module.exports = {
    name: "nombre del comando",
    description: "descripción del comando",
    BotPerms: ["Administrator", "KickMembers", "BanMembers"], //permisos que necesitará el bot para ejecutar el comando
    UserPerms: ["Administrator", "KickMembers", "BanMembers"], //permisos que necesitará el usuario para ejecutar el comando
    owner: true, //comandos del dueño,
    timeout: 5000, //tiempo de espera para comandos
    
    /**
    *@param {ChatInputCommandInteraction} interaction
    *@param {Client} client
    */
    async execute(interaction, client){
        //ejecución del comando
        return interaction.reply("lo que quieras")
    }
}
```

## 💪 Características

- ✅ Escalable
- ✅ Organizado
- ✅ Base de Datos MongoDB
- ✅ Comandos Slash
- ✅ Recarga el bot sin tener que reiniciar

## ❤ Donaciones
Gracias por usar este código! Si quieres apoyarnos puedes hacerlo realizando una [donación a través de PayPal](https://paypal.me/NavasMena).

Todas las donaciones serán utilizadas para mejorar los bots. ¡Gracias!

## 🔰 Soporte
Si necesitas ayuda, puedes acudir a nuestro <img src="https://cdn.discordapp.com/emojis/1046290355471011880.png" width="16" style="border-radius: 50%;"></img> [Servidor de Soporte](https://discord.gg/XhRMnh3KXZ).