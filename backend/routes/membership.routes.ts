import {Router} from 'express';

const router = Router();

router.post("/:id/join", async (req, res) => {
    res.json({message: "Hello from the membership route!"});
});

router.get("/:id/requests", async (req, res) => {
    res.json({message: "Hello from the membership route!"});
});

router.patch("/:id/requests/:requestId", async (req, res) => {
    res.json({message: "Hello from the membership route!"});
}); 

router.get("/:id/members", async (req, res) => {
    res.json({message: "Hello from the membership route!"});
});

export default router;