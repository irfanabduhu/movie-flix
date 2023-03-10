const router = require("express").Router();
const movieController = require("../controllers/movie");

router.get("/", movieController.getAll);
router.get("/:title", movieController.getByTitle);
router.post("/", movieController.create);
router.put("/:id", movieController.update);
router.delete("/:id", movieController.delete);

module.exports = router;
