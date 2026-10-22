const jwt = require("jsonwebtoken");
const Menu = require("../models/menu.model");
const catagoryModel = require("../models/catagory.model");
const Table = require("../models/tables.model");
const Hotel = require("../models/hotel_info.model");
const Session = require("../models/session.model");
const Order = require("../models/orders.model");
const Bill = require("../models/bill.model");
const calculateOrderStatus = require("../utils/orderStatus");
async function allfetch(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Invalid table",
        success: false,
      });
    }

    // Find table
    const table = await Table.findOne({ _id: id });

    if (!table) {
      return res.status(404).json({
        message: "Table not found",
        success: false,
      });
    }

    // Find hotel
    const hotel = await Hotel.findById(table.hotelId);

    if (!hotel) {
      return res.status(404).json({
        message: "Hotel not found",
        success: false,
      });
    }

    // Check existing active session
    let session = await Session.findOne({
      tableId: table._id,
      status: "ACTIVE",
    });

    // Create new session if not available
    if (!session) {
      session = await Session.create({
        hotelId: hotel._id,
        tableId: table._id,
        status: "ACTIVE",
      });

      const order = await Order.create({
        hotelId: hotel._id,
        tableId: table._id,
        sessionId: session._id,
        items: [],
        totalAmount: 0,
      });

      console.log("New session created:", session._id);
    }

    // Create JWT
    const token = jwt.sign(
      {
        sessionId: session._id,
        tableId: table._id,
        hotelId: hotel._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      },
    );

    // Save JWT in cookie
    res.cookie("customerSession", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 2 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Customer session created",
      hotel,
      table,
      session,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

async function fetchMenu(req, res) {
  if (!req.hotel || !req.session || !req.table) {
    return res.status(400).json({
      message: "Scan it again",
      success: false,
    });
  }

  try {
    const [dishes, cat] = await Promise.all([
      Menu.find({ hotelId: req.hotel._id }),
      catagoryModel.find({ hotelId: req.hotel._id }),
    ]);

    return res.status(200).json({
      message: "Menu and categories fetched successfully",
      success: true,
      dishes,
      categories: cat,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching the data",
      success: false,
      error: error.message,
    });
  }
}
async function fetchOrder(req, res) {
  if (!req.hotel || !req.session || !req.table) {
    return res.status(400).json({
      message: "Scan it again",
      success: false,
    });
  }

  try {
    const order = await Order.findOne({
      sessionId: req.session._id,
      hotelId: req.hotel._id,
      tableId: req.table._id,
    }).populate({
      path: "items.menuId",
      select: "dishName image",
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        success: false,
      });
    }

    // Calculate total excluding cancelled items
    const totalAmount = order.items.reduce((sum, item) => {
      if (item.status === "Cancelled") {
        return sum;
      }

      return sum + (item.finalprice ?? item.price) * item.quantity;
    }, 0);

    return res.status(200).json({
      message: "Order fetched successfully",
      success: true,
      order: {
        ...order.toObject(),
        totalAmount,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching the order",
      success: false,
      error: error.message,
    });
  }
}

async function confirmOrder(req, res) {
  if (!req.hotel || !req.session || !req.table) {
    return res.status(400).json({
      message: "Scan it again",
      success: false,
    });
  }

  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        message: "Invalid order items",
        success: false,
      });
    }

    let order = await Order.findOne({
      sessionId: req.session._id,
    });

    if (!order) {
      order = await Order.create({
        hotelId: req.hotel._id,
        tableId: req.table._id,
        sessionId: req.session._id,
        items: [],
        totalAmount: 0,
        orderStatus: "Preparing",
      });

      req.session.orderId = order._id;
      await req.session.save();
    }

    const orderItems = items.map((item) => ({
      menuId: item.menuId,
      variantName: item.variantName,
      price: item.price,
      finalprice: item.finalPrice,
      quantity: item.quantity,
    }));

    order.items.push(...orderItems);

    const addedAmount = orderItems.reduce(
      (sum, item) => sum + item.finalprice * item.quantity,
      0
    );

    order.totalAmount = (order.totalAmount || 0) + addedAmount;

    order.orderStatus = calculateOrderStatus(order.items);

    await order.save();

    // ================================
    // UPDATE TODAY SOLD & TOTAL SOLD
    // ================================

    const sales = {};

    // Combine quantity of same dish
    // Variant does NOT matter here
    for (const item of orderItems) {
      if (!sales[item.menuId]) {
        sales[item.menuId] = 0;
      }

      sales[item.menuId] += item.quantity;
    }

    const today = new Date();

    for (const menuId in sales) {
      const menu = await Menu.findById(menuId);

      if (!menu) {
        continue;
      }

      const quantity = sales[menuId];

      const lastSoldDate = new Date(menu.todaySoldDate);

      const isSameDay =
        today.getFullYear() === lastSoldDate.getFullYear() &&
        today.getMonth() === lastSoldDate.getMonth() &&
        today.getDate() === lastSoldDate.getDate();

      if (isSameDay) {
        // Same day → increase today's sales
        menu.todaySold += quantity;
      } else {
        // New day → start today's sales
        menu.todaySold = quantity;
        menu.todaySoldDate = today;
      }

      // Lifetime sales
      menu.totalSold += quantity;

      await menu.save();
    }

    return res.status(200).json({
      message: "Order confirmed successfully",
      success: true,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error confirming the order",
      success: false,
      error: error.message,
    });
  }
}


async function status(req, res) {
  if (!req.hotel || !req.session || !req.table) {
    return res.status(400).json({
      message: "Invalid request data",
      success: false,
    });
  }

  try {
 
const order = await Order.findOne({
  sessionId: req.session._id,
  hotelId: req.hotel,
  tableId: req.table,
}).populate("items.menuId");


    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        success: false,
      });
    }

  const pendingItems = order.items
  .filter(
    (item) =>
      item.status !== "Served" &&
      item.status !== "Cancelled"
  )
  .map((item) => {
    const dish = item.menuId?.dishName || "Unknown dish";
    return `${dish} - ${item.variantName}`;
  });

console.log(pendingItems);

    return res.status(200).json({
      message: "Order status retrieved successfully",
      success: true,
      order,
      allServed: pendingItems.length === 0,
      pendingItems,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving order status",
      success: false,
      error: error.message,
    });
  }
}


//generate bill 
const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

const generateBill = async (req, res) => {
  try {
    // 1. Validate the authenticated customer session
    if (!req.session || !req.hotel || !req.table) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer session",
      });
    }

    const sessionId = req.session._id;

    // 2. If a bill already exists, return it instead of creating a duplicate
    const existingBill = await Bill.findOne({ sessionId });

    if (existingBill) {
      return res.status(200).json({
        success: true,
        message: "Bill already generated",
        bill: existingBill,
      });
    }

    // 3. Fetch all orders belonging to this session
    const orders = await Order.find({
      sessionId,
      hotelId: req.hotel,
      tableId: req.table,
    }).populate("items.menuId");

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this session",
      });
    }

    // 4. Ensure all items have been served or cancelled
    const pendingItems = orders.flatMap((order) =>
      order.items
        .filter(
          (item) =>
            item.status !== "Served" &&
            item.status !== "Cancelled"
        )
        .map((item) => ({
          name: item.menuId?.name || "Unknown item",
          status: item.status,
        }))
    );

    if (pendingItems.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot generate bill while items are pending",
        pendingItems,
      });
    }

    // 5. Collect billable items, excluding cancelled items
    const billItems = [];

    for (const order of orders) {
      for (const item of order.items) {
        if (item.status === "Cancelled") continue;

        const unitPrice = Number(item.finalprice ?? item.price);
        const quantity = Number(item.quantity);

        if (
          !Number.isFinite(unitPrice) ||
          unitPrice < 0 ||
          !Number.isInteger(quantity) ||
          quantity < 1
        ) {
          return res.status(400).json({
            success: false,
            message: "Invalid price or quantity in an order item",
          });
        }

        // Update `name` if your Menu schema uses a different field.
        const name =
          item.menuId?.name ||
          item.menuId?.dishName ||
          item.menuId?.itemName;

        if (!name) {
          return res.status(400).json({
            success: false,
            message:
              "Menu item name not found. Check your Menu schema and populate configuration.",
          });
        }

        const itemTotal = round2(unitPrice * quantity);

        billItems.push({
          menuId: item.menuId?._id,
          name,
          variantName: item.variantName || "",
          price: unitPrice,
          quantity,
          itemTotal,
        });
      }
    }

    if (!billItems.length) {
      return res.status(400).json({
        success: false,
        message: "There are no billable items in this session",
      });
    }

    // 6. Calculate the subtotal and GST.
    // Configure these rates according to the restaurant's actual tax rules.
    const cgstPercent = 2.5;
    const sgstPercent = 2.5;

    const subtotal = round2(
      billItems.reduce((sum, item) => sum + item.itemTotal, 0)
    );

    const cgst = round2((subtotal * cgstPercent) / 100);
    const sgst = round2((subtotal * sgstPercent) / 100);
    const total = round2(subtotal + cgst + sgst);

    // 7. Save the bill
    const bill = await Bill.create({
      hotelId: req.hotel,
      tableId: req.table,
      sessionId,
      items: billItems,
      subtotal,
      cgstPercent,
      cgst,
      sgstPercent,
      sgst,
      total,
      paymentStatus: "Pending",
    });

    return res.status(201).json({
      success: true,
      message: "Bill generated successfully",
      bill,
    });
  } catch (error) {
    // Handle two simultaneous requests for the same session
    if (error.code === 11000) {
      const existingBill = await Bill.findOne({
        sessionId: req.session?._id,
      });

      if (existingBill) {
        return res.status(200).json({
          success: true,
          message: "Bill already generated",
          bill: existingBill,
        });
      }
    }

    console.error("Generate bill error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate bill",
    });
  }
};

//bill preview

const getBillPreview = async (req, res) => {
  try {
    if (!req.session || !req.hotel || !req.table) {
      return res.status(401).json({
        success: false,
        message: "Invalid customer session",
      });
    }

    const bill = await Bill.findOne({
      sessionId: req.session._id,
      hotelId: req.hotel,
      tableId: req.table,
    })
      .populate("hotelId")
      .populate("tableId");

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }

    const hotel = bill.hotelId;
    const table = bill.tableId;

    return res.status(200).json({
      success: true,
      bill: {
        ...bill.toObject(),

        // Adjust these field names to match your schemas.
        restaurantName:
          hotel?.name || hotel?.hotelName || "Restaurant",

        tableNumber:
          table?.tableNumber ?? table?.number ?? "N/A",

        date: bill.createdAt
          ? new Date(bill.createdAt).toLocaleDateString("en-IN")
          : "",

        time: bill.createdAt
          ? new Date(bill.createdAt).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
      },
    });
  } catch (error) {
    console.error("Get bill preview error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch bill",
    });
  }
};

module.exports = {
  allfetch,
  fetchMenu,
  fetchOrder,
  confirmOrder,
  status,
  generateBill,
  getBillPreview
};
