function calculateOrderStatus(items) {
  if (!items.length) return "Preparing";

  if (items.every((item) => item.status === "Cancelled")) return "Cancelled";

  if (
    items.every(
      (item) => item.status === "Served" || item.status === "Cancelled"
    )
  )
    return "Served";

  if (
    items.every(
      (item) =>
        item.status === "Ready" ||
        item.status === "Served" ||
        item.status === "Cancelled"
    )
  )
    return "Ready";

  return "Preparing";
}

module.exports = calculateOrderStatus;