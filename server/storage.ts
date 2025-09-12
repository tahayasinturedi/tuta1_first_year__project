import { type User, type InsertUser, type Conversion, type InsertConversion, type UpdateConversion } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Conversion methods
  createConversion(conversion: InsertConversion): Promise<Conversion>;
  getConversion(id: string): Promise<Conversion | undefined>;
  getAllConversions(): Promise<Conversion[]>;
  updateConversion(id: string, updates: UpdateConversion): Promise<Conversion | undefined>;
  deleteConversion(id: string): Promise<boolean>;
  getConversionStats(): Promise<{
    totalUploaded: number;
    totalConverted: number;
    avgProcessingTime: string;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private conversions: Map<string, Conversion>;

  constructor() {
    this.users = new Map();
    this.conversions = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createConversion(insertConversion: InsertConversion): Promise<Conversion> {
    const id = randomUUID();
    const conversion: Conversion = {
      ...insertConversion,
      id,
      createdAt: new Date(),
      completedAt: null,
    };
    this.conversions.set(id, conversion);
    return conversion;
  }

  async getConversion(id: string): Promise<Conversion | undefined> {
    return this.conversions.get(id);
  }

  async getAllConversions(): Promise<Conversion[]> {
    return Array.from(this.conversions.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async updateConversion(id: string, updates: UpdateConversion): Promise<Conversion | undefined> {
    const existing = this.conversions.get(id);
    if (!existing) return undefined;

    const updated: Conversion = {
      ...existing,
      ...updates,
      ...(updates.status === "completed" && !existing.completedAt ? { completedAt: new Date() } : {}),
    };
    
    this.conversions.set(id, updated);
    return updated;
  }

  async deleteConversion(id: string): Promise<boolean> {
    return this.conversions.delete(id);
  }

  async getConversionStats(): Promise<{
    totalUploaded: number;
    totalConverted: number;
    avgProcessingTime: string;
  }> {
    const conversions = Array.from(this.conversions.values());
    const totalUploaded = conversions.length;
    const completed = conversions.filter(c => c.status === "completed");
    const totalConverted = completed.length;

    let avgProcessingTime = "--";
    if (completed.length > 0) {
      const totalTime = completed.reduce((sum, conv) => {
        if (conv.completedAt && conv.createdAt) {
          return sum + (conv.completedAt.getTime() - conv.createdAt.getTime());
        }
        return sum;
      }, 0);
      
      const avgMs = totalTime / completed.length;
      const avgSeconds = Math.round(avgMs / 1000);
      avgProcessingTime = `${avgSeconds}s`;
    }

    return {
      totalUploaded,
      totalConverted,
      avgProcessingTime,
    };
  }
}

export const storage = new MemStorage();
