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

export const list = query({
  args: { partyId: v.id("parties") },
  handler: async (ctx, args) => {
    const party = await ctx.db.get(args.partyId);
    if (!party) {
      return [];
    }

    const requests = await ctx.db
      .query("requests")
      .withIndex("by_party", (q) => q.eq("partyId", args.partyId))
      .collect();

    // Filter explicit content if party doesn't allow it
    const filtered = party.allowsExplicit
      ? requests
      : requests.filter((r) => !r.explicit);

    // Sort by number of requesters (descending), then by name
    return filtered.sort((a, b) => {
      if (b.requesters.length !== a.requesters.length) {
        return b.requesters.length - a.requesters.length;
      }
      return a.name.localeCompare(b.name);
    });
  },
});

export const addRequest = mutation({
  args: {
    partyId: v.id("parties"),
    spotifyId: v.string(),
    name: v.string(),
    artists: v.array(v.string()),
    image: v.string(),
    explicit: v.boolean(),
    previewUrl: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const email = await getUserEmail(ctx, userId);
    if (!email) {
      throw new Error("User has no email");
    }

    // Check if party exists and if explicit content is allowed
    const party = await ctx.db.get(args.partyId);
    if (!party) {
      throw new Error("Party not found");
    }

    // Block explicit songs if party doesn't allow them
    if (args.explicit && !party.allowsExplicit) {
      throw new Error("This party does not allow explicit songs");
    }

    // Check if request already exists
    const existing = await ctx.db
      .query("requests")
      .withIndex("by_party_and_spotify", (q) =>
        q.eq("partyId", args.partyId).eq("spotifyId", args.spotifyId)
      )
      .first();

    if (existing) {
      // Add user to requesters if not already there
      if (!existing.requesters.includes(email)) {
        await ctx.db.patch(existing._id, {
          requesters: [...existing.requesters, email],
        });
      }
      return existing._id;
    }

    // Create new request
    return await ctx.db.insert("requests", {
      partyId: args.partyId,
      spotifyId: args.spotifyId,
      name: args.name,
      artists: args.artists,
      image: args.image,
      explicit: args.explicit,
      previewUrl: args.previewUrl,
      requesters: [email],
    });
  },
});

export const removeRequest = mutation({
  args: { partyId: v.id("parties"), spotifyId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const email = await getUserEmail(ctx, userId);
    if (!email) {
      throw new Error("User has no email");
    }

    const request = await ctx.db
      .query("requests")
      .withIndex("by_party_and_spotify", (q) =>
        q.eq("partyId", args.partyId).eq("spotifyId", args.spotifyId)
      )
      .first();

    if (!request) return;

    if (request.requesters.length === 1) {
      // Delete if this was the only requester
      await ctx.db.delete(request._id);
    } else {
      // Remove user from requesters
      await ctx.db.patch(request._id, {
        requesters: request.requesters.filter((r) => r !== email),
      });
    }
  },
});

export const deleteRequest = mutation({
  args: { partyId: v.id("parties"), spotifyId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const email = await getUserEmail(ctx, userId);

    const party = await ctx.db.get(args.partyId);
    if (!party || party.host !== email) {
      throw new Error("Only the host can delete requests");
    }

    const request = await ctx.db
      .query("requests")
      .withIndex("by_party_and_spotify", (q) =>
        q.eq("partyId", args.partyId).eq("spotifyId", args.spotifyId)
      )
      .first();

    if (request) {
      await ctx.db.delete(request._id);
    }
  },
});
