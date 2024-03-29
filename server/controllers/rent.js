const Rent = require("../models/rent");
const User = require("../models/user");

exports.getAll = async (req, res) => {
  try {
    const rents = await Rent.findAll();
    const count = rents?.length ?? 0;
    res.status(200).json({
      rents,
      message: `Found ${count} ${count > 1 ? "rents" : "rent."}`,
    });
  } catch (err) {
    res.status(500);
    res.json({
      message: `An error occurred while fetching rent data: ${err.message}`,
    });
  }
};

exports.getByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const rents = await Rent.findAll({ where: { UserId: id } });
    const count = rents?.length ?? 0;
    res.status(200).json({
      rents,
      message: `Found ${count} ${count > 1 ? "rents" : "rent."}`,
    });
  } catch (err) {
    res.status(500);
    res.json({
      message: `An error occurred while fetching rent data: ${err.message}`,
    });
  }
};

exports.getByMovieId = async (req, res) => {
  try {
    const { id } = req.params;
    const rents = await Rent.findAll({ where: { MovieId: id } });
    const count = rents?.length ?? 0;
    res.status(200).json({
      rents,
      message: `Found ${count} ${count > 1 ? "rents" : "rent."}`,
    });
  } catch (err) {
    res.status(500);
    res.json({
      message: `An error occurred while fetching rent data: ${err.message}`,
    });
  }
};

exports.getRentStatus = async (req, res) => {
  const { userId, movieId } = req.query;
  if (!userId || !movieId) {
    return res.status(400).json({
      message: "Need to provide the required fields 'userId', and 'movieId'",
    });
  }

  try {
    const rent = await Rent.findOne({
      where: { MovieId: movieId, UserId: userId },
    });

    console.log(movieId, userId, rent);

    if (!rent) {
      return res.status(404).json({
        message: "User didn't rent this movie.",
      });
    }

    if (new Date(rent.rentPeriod) < new Date()) {
      return res.status(401).json({
        message: "Rent expired.",
      });
    }

    res.status(200).json({
      validTill: rent.validTill,
    });
  } catch (err) {
    res.status(500).json({
      message: `An error occurred while fetching rent status: ${err.message}`,
    });
  }
}; 

exports.create = async (req, res) => {
  try {
    const { userId, movieId, rentPeriod, rentPrice } = req.body;

    if (!userId || !movieId || !rentPeriod || !rentPrice) {
      return res.status(400).json({
        message:
          "Need to provide the required fields 'userId', 'movieId', 'rentPeriod', and 'rentPrice'",
      });
    }

    const user = await User.findByPk(userId);
    if (user.plan === "premium") {
      return res.status(202).json({
        message:
          "You are on the premium plan. You can stream the movie without renting.",
      });
    }

    const validTill = new Date();
    validTill.setDate(validTill.getDate() + rentPeriod);

    const rent = await Rent.upsert({
      MovieId: movieId,
      UserId: userId,
      validTill,
      rentPrice,
    });

    res.status(201);
    res.json({
      cast: rent,
      message: `Successfully created a rent.`,
    });
  } catch (err) {
    res.status(400);
    res.json({
      message: `Could not create the rent. Error: ${err.message}`,
    });
  }
};

exports.update = async (req, res) => {
  const { movieId, userId, rentPeriod, rentPrice } = req.body;

  if (!userId || !movieId) {
    res.status(400);
    return res.json({
      message: "Need to provide the required fields 'userId', and 'movieId'",
    });
  }

  const requestBody = {};
  if (rentPeriod) requestBody.rentPeriod = rentPeriod;
  if (rentPrice) requestBody.rentPrice = rentPrice;

  try {
    const [count, rents] = await Cast.update(requestBody, {
      where: { MovieId: movieId, UserId: userId },
      returning: true,
    });
    if (count === 0) {
      res.status(404);
      return res.json({
        message: `Rent with movie id: '${movieId}' and user id: '${userId}' cannot be found.`,
      });
    }

    res.status(200);
    res.json({
      rent: rents[0],
      message: "Successfully updated the cast",
    });
  } catch (err) {
    res.status(500);
    res.json({ message: `An error occurred: ${err.message}` });
  }
};

exports.delete = async (req, res) => {
  const { movieId, userId } = req.body;

  if (!userId || !movieId) {
    return res.status(400).json({
      message: "Need to provide the required fields 'userId', and 'movieId'",
    });
  }

  try {
    const count = await Rent.destroy({
      where: { MovieId: movieId, UserId: userId },
    });
    if (count === 0) {
      res.status(404);
      res.json({
        message: `Rent with movie id: '${movieId}' and user id: '${userId}' cannot be found.`,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: `An error occurred while deleting the rent: ${err.message}`,
    });
  }
};
