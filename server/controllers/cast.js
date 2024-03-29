const Cast = require("../models/cast");

exports.getAll = async (req, res) => {
  try {
    const casts = await Cast.findAll();
    const count = casts?.length ?? 0;
    res.status(200).json({
      casts,
      message: `Found ${count} ${count > 1 ? "casts" : "cast."}`,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getByName = async (req, res) => {
  const name = req.params.name;
  try {
    const cast = await Cast.findOne({ where: { name } });
    if (!cast) {
      return res.status(404).json({
        message: `Cast with name '${name}' cannot be found.`,
      });
    }
    res.status(200).json({ cast });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400);
      return res.json({
        message: "Need to provide the required field 'name'",
      });
    }
    const cast = await Cast.create({ name });
    res.status(201);
    res.json({
      cast,
      message: `Successfully created a cast.`,
    });
  } catch (err) {
    res.status(400);
    res.json({
      message: `Could not create the cast. Error: ${err.message}`,
    });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    res.status(400);
    return res.json({ message: "Name field in request body is required." });
  }

  try {
    const [count, casts] = await Cast.update(
      { name },
      { where: { id }, returning: true }
    );

    if (count === 0) {
      res.status(404);
      return res.json({
        message: `Cast with id: '${id}' cannot be found.`,
      });
    }

    res.status(200);
    res.json({
      cast: casts[0],
      message: "Successfully updated the cast",
    });
  } catch (err) {
    res.status(500);
    res.json({ message: `An error occurred: ${err.message}` });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const count = await Cast.destroy({ where: { id } });
    if (count === 0) {
      res.status(404);
      return res.json({
        message: `Cast with id: '${id}' cannot be found.`,
      });
    }
    res.status(204);
    res.json({
      message: "Successfully deleted the cast.",
    });
  } catch (err) {
    res.status(500);
    res.json({
      message: `An error occurred while deleting a cast: ${err.message}`,
    });
  }
};
