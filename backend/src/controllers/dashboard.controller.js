// controllers/menuController.js
const Menu=require("../models/menu.model")

// GET /api/menu/top-selling?limit=5   (hotelId comes from auth cookie/token)
 async function getTopSellingDishes(req, res){
  try {
    const hotelId =req.hotel; // match whatever your middleware sets
    const { limit = 5 } = req.query;

    if (!hotelId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const dishes = await Menu.find({ hotelId: hotelId._id })
      .sort({ todaySold: -1 })
      .limit(Number(limit))
      .select("dishName todaySold totalSold");

    const formatted = dishes.map((d) => ({
      name: d.dishName,
      count: d.todaySold,
    }));

    return res.status(200).json({ success: true, dishes: formatted });
  } catch (error) {
    console.error("getTopSellingDishes error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getTopSellingDishes };