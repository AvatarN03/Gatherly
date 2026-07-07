import express from "express";
import cors from "cors";

import { clerkMiddleware } from "@clerk/express";

import communityRoutes from "./routes/community.routes.ts";
import dashboardRoutes from "./routes/dashboard.routes.ts";
import eventRoutes from "./routes/event.routes.ts";
import membershipRoutes from "./routes/membership.routes.ts";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.use("/api/communities", communityRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/memberships", membershipRoutes);
app.use("/api/events", eventRoutes);

app.get("/", (req, res) => {
  res.json(`Welcome to the Event & Community Management API 
        Congrats hacker !!
        To catch the Project backend route 👏🏻👏🏻👏🏻👏🏻
      `);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
