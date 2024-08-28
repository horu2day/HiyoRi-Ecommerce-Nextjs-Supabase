import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";
import * as seed from "./seedData";
import { exit } from "process";

dotenv.config();
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

const queryClient = postgres(process.env.DATABASE_URL);
export const db = drizzle(queryClient, { schema });

const seeddata = async () => {
  try {
    //await seed.medias();
    await seed.profiles();
    await seed.collections();
    await seed.products();
    await seed.shopOrders();
    await seed.address();

    console.log("Seeding completed successfully");
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await queryClient.end();
    exit();
  }
};

seeddata();
// import * as dotenv from "dotenv";
// import { drizzle } from "drizzle-orm/postgres-js";
// import postgres from "postgres";

// import * as schema from "./schema";
// import * as seed from "./seedData";
// import { exit } from "process";

// // import { seedMedias } from "./seedData/medias"
// // import { seedCollections } from "./seedData/collections"

// dotenv.config();
// if (!process.env.DATABASE_URL) {
//   throw new Error("DATABASE_URL is missing");
// }

// const queryClient = postgres(process.env.DATABASE_URL);
// export const db = drizzle(queryClient, { schema });

// const seeddata = async () => {
//   // await seed.medias()
//   await seed.collections();
//   await seed.products();
//   // await seed.shopOrders()
//   // await seed.address()

//   exit();
// };

// seeddata();
