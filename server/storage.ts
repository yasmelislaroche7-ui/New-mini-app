import { users, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByWallet(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserBalance(walletAddress: string, stakedBalance: string): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.walletAddress, walletAddress.toLowerCase()));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values({
      ...insertUser,
      walletAddress: insertUser.walletAddress.toLowerCase(),
    }).returning();
    return user;
  }

  async updateUserBalance(walletAddress: string, stakedBalance: string): Promise<User> {
    const [user] = await db.update(users)
      .set({ stakedBalance, lastStakeAt: new Date() })
      .where(eq(users.walletAddress, walletAddress.toLowerCase()))
      .returning();
    
    if (!user) throw new Error("User not found");
    return user;
  }
}

export const storage = new DatabaseStorage();
