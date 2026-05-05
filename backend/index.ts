import express from "express";
import cors from "cors";

import userRoutes from "./routes/user.routes.ts";
import communityRoutes from "./routes/community.routes.ts";
import membershipRoutes from "./routes/membership.routes.ts";

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/users", userRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/memberships", membershipRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Community Management API");
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});