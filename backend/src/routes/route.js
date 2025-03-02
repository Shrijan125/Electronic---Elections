import { Router } from "express";
import { authorisevoter, castvote, registervoter, tallyvote,reconstructTally } from "../controllers/electronic_elections.controllers.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

router.post("/registervoter", registervoter);
router.post("/castvote", castvote);
router.post("/authorisevoter",authorisevoter);
router.get("/tallyvote",tallyvote);
router.post("/reconstructtally",reconstructTally);


export default router;
