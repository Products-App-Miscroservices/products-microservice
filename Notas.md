# Creación de organización para agrupar repositorios
https://www.udemy.com/course/nestjs-microservicios/learn/lecture/42560210#questions
1. Click sobre el perfir (ubicado en la parte superior derecha).
2. En el menú desplegable que aparece seleccionar __Your Organizations__.
3. Hacer click sobre botón __New organization__
4. Seleccionar plan gratuito.
	1. Nombrar organización. (Products-App-Miscroservices)
	2. Colocar email.
	3. Establecer que la organización pertenece a la cuenta propia.
5. En repositorios se crea uno nuevo para empezar a subir los repositorio

# Creación de proyecto
1. Crear carpeta en donde se colocaran todos los repositorios.
2. Crear nuevo proyecto con:
```bash
nest new products-ms
```
3. Borrar archivos que no se ocupan:
    1. app.controller.ts
    2. app.service.ts
    3. app.controller.spec.ts

4. Creación de recurso.
    - Crear recurso como microservicio.
    - No cread métodos CRUD.
```bash
nest g resource <nombre> --no-spec # no spec para que no genere archivos de test
ó
nest g res <nombre>
```

5. Instalar paquetes de microservicio y nats.
```bash
npm i --save @nestjs/microservices nats
```

6. Ajustar __main.ts__ para crear microservicio.
```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { envs } from './products/config/envs';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Products Microservice');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: envs.natsServers
      }
    }
  );

  await app.listen();
  logger.log(`Products Microservice running on port ${envs.port}`);
}
bootstrap();

```
6. Crear __src/config/services.ts__.
```ts
export const NATS_SERVICE = 'NATS_SERVICE'
```
7. Crear módulo de NATS __src/transports/nats.module.ts__.
```ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from 'src/config/envs';
import { NATS_SERVICE } from 'src/config/services';

@Module({
    imports: [
        ClientsModule.register([
            { name: NATS_SERVICE, 
              transport: Transport.NATS,
              options: {
                servers: envs.natsServers
              }
            },
        ])
    ],
    exports: [
        ClientsModule.register([
            { name: NATS_SERVICE, 
              transport: Transport.NATS,
              options: {
                servers: envs.natsServers
              }
            },
        ])
    ]
})
export class NatsModule {}

```

8. Ocupar módulo de Nats en módulo del recurso.
__products.module.ts__
```ts
import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [NatsModule]
})
export class ProductsModule {}

```

## Variables de entorno
1. Instalar paquetes
```bash
npm i dotenv joi
```

2. Crear __src/config/envs.ts__.
3. Crear archivos __.env__ y __.env.template__

## Prisma
1. Instalar Prisma.
```bash
npm i prisma -D
```
### MongoDB
- [Documentación](https://www.prisma.io/docs/orm/overview/databases/mongodb) de prisma con mongoDB.
1. En cadena de conexión conseguida colocar al final la base de datos. (Se crea la base de datos en MongoDB Atlas).
2. Iniciar Prisma.
```bash
npx prisma init
```
3. Crear modelos en __prisma/schema.prisma__.
4. Generar cliente
    - Con MongoDB no se requieren hacer migraciones, ya que las bases de datos no relacionales son más volátiles.
```bash
npx prisma generate
```

## Paquetes para validaciones
1. Instalar paquetes.
```bash
npm i class-validator class-transformer
```

2. Establecer global pipes en __main.ts__.
```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './products/config/envs';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Products Microservice');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: envs.natsServers
      }
    }
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )

  await app.listen();
  logger.log(`Products Microservice running on port ${envs.port}`);
}
bootstrap();

```