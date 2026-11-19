// Carga las variables del archivo .env que está en la raíz del monorepo
import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(__dirname, '..', '..', '.env'), quiet: true });

export {}
