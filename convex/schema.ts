import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  otpCodes: defineTable({
    email: v.string(),
    code: v.string(),
    expiresAt: v.number(),
    verified: v.boolean(),
  }).index("by_email", ["email"]),

  parties: defineTable({
    allowsExplicit: v.boolean(),
    host: v.string(),
    createdAt: v.number(),
  }),

  requests: defineTable({
    partyId: v.id("parties"),
    spotifyId: v.string(),
    name: v.string(),
    artists: v.array(v.string()),
    image: v.string(),
    explicit: v.boolean(),
    previewUrl: v.union(v.string(), v.null()),
    requesters: v.array(v.string()),
  })
    .index("by_party", ["partyId"])
    .index("by_party_and_spotify", ["partyId", "spotifyId"]),
});
