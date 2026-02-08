import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

async function getUserEmail(ctx: any, userId: any): Promise<string | null> {
  const user = await ctx.db.get(userId);
  if (!user) return null;

  if (user.email) return user.email;

  const accounts = await ctx.db
    .query("authAccounts")
    .filter((q: any) => q.eq(q.field("userId"), userId))
    .collect();

  for (const account of accounts) {
    if (account.providerAccountId?.includes("@")) {
      return account.providerAccountId;
    }
  }

  return null;
}

export const get = query({
  args: { id: v.id("parties") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const exists = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    try {
      const party = await ctx.db.get(args.id as any);
      return { exists: !!party };
    } catch {
      return { exists: false };
    }
  },
});

export const create = mutation({
  args: { allowsExplicit: v.boolean() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const email = await getUserEmail(ctx, userId);
    if (!email) {
      throw new Error("User has no email");
    }

    const partyId = await ctx.db.insert("parties", {
      allowsExplicit: args.allowsExplicit,
      host: email,
      createdAt: Date.now(),
    });

    return partyId;
  },
});

export const updateExplicitMode = mutation({
  args: { id: v.id("parties"), allowsExplicit: v.boolean() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const email = await getUserEmail(ctx, userId);

    const party = await ctx.db.get(args.id);
    if (!party || party.host !== email) {
      throw new Error("Only the host can update settings");
    }

    await ctx.db.patch(args.id, {
      allowsExplicit: args.allowsExplicit,
    });
  },
});

export const deleteParty = mutation({
  args: { id: v.id("parties") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const email = await getUserEmail(ctx, userId);

    const party = await ctx.db.get(args.id);
    if (!party || party.host !== email) {
      throw new Error("Only the host can delete the party");
    }

    // Delete all requests for this party
    const requests = await ctx.db
      .query("requests")
      .withIndex("by_party", (q) => q.eq("partyId", args.id))
      .collect();

    for (const request of requests) {
      await ctx.db.delete(request._id);
    }

    // Delete the party
    await ctx.db.delete(args.id);
  },
});

export const getCurrentUserEmail = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await getUserEmail(ctx, userId);
  },
});
