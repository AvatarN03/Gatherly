import { prisma } from "../utils/prisma.ts";

async function main() {
  // 🔹 Create Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: "user_1",
        email: "user1@test.com",
        name: "User One",
        imageUrl: "",
      },
    }),

    prisma.user.create({
      data: {
        id: "user_2",
        email: "user2@test.com",
        name: "User Two",
        imageUrl: "",
      },
    }),

    prisma.user.create({
      data: {
        id: "user_3",
        email: "user3@test.com",
        name: "User Three",
        imageUrl: "",
      },
    }),

    prisma.user.create({
      data: {
        id: "user_4",
        email: "user4@test.com",
        name: "User Four",
        imageUrl: "",
      },
    }),
  ]);

  // 🔹 Create Communities
  const communities = await Promise.all([
    prisma.community.create({
      data: {
        name: "Tech Community",
        description: "All about tech",
        imageUrl: "",
        location: "Mumbai",
        createdById: users[0].id,
      },
    }),

    prisma.community.create({
      data: {
        name: "Sports Club",
        description: "Sports lovers",
        imageUrl: "",
        location: "Pune",
        createdById: users[1].id,
      },
    }),

    prisma.community.create({
      data: {
        name: "Music Group",
        description: "Music enthusiasts",
        imageUrl: "",
        location: "Delhi",
        createdById: users[2].id,
      },
    }),
  ]);

  // 🔹 Add Owners as Members
  await Promise.all([
    prisma.membership.create({
      data: {
        userId: users[0].id,
        communityId: communities[0].id,
        role: "OWNER",
      },
    }),

    prisma.membership.create({
      data: {
        userId: users[1].id,
        communityId: communities[1].id,
        role: "OWNER",
      },
    }),

    prisma.membership.create({
      data: {
        userId: users[2].id,
        communityId: communities[2].id,
        role: "OWNER",
      },
    }),
  ]);

  // 🔹 Create Membership Requests
  await prisma.membershipRequest.createMany({
    data: [
      {
        userId: users[3].id,
        communityId: communities[0].id,
        proofUrl: "proof1",
      },

      {
        userId: users[2].id,
        communityId: communities[1].id,
        proofUrl: "proof2",
      },
    ],
  });

  console.log("✅ Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });