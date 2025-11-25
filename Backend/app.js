import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";


dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use("/api/admin", adminRoutes);


//checking for backend running status
app.get("/", (req, res) => {
  res.send("Admin Panel Backend Running ");
});

// Routes
app.use('/api/auth', authRoutes); //for login or signin
app.use("/api/user", userRoutes);  //for see and update your profile

console.log("Auth Routes Registered: ", authRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
