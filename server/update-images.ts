import { db } from "./db";
import { products } from "../shared/schema";
import { eq } from "drizzle-orm";

async function updateImages() {
  await db.update(products)
    .set({ image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400" })
    .where(eq(products.id, 4));
  
  await db.update(products)
    .set({ image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400" })
    .where(eq(products.id, 6));
  
  console.log("Images updated!");
  process.exit(0);
}

updateImages().catch(console.error);
