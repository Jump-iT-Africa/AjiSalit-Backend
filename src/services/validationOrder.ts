export function ValidationOrder(newOrder) {
  if (newOrder.situation == "PAID" || newOrder.situation == "UNPAID") {
    if (newOrder.advancedAmount !== null)
      return "Ops you have to choose the situation of partially PAID to be able to add advanced amount";
  }
  if (newOrder.situation == "PREPAYMENT") {
    if (newOrder.price <= newOrder.advancedAmount)
      return "The advanced amount of The order suppose to be less than the total price";
  }
  let todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  if (
    newOrder.estimatedDeliveryDate !== null &&
    new Date(newOrder.estimatedDeliveryDate) < todayDate
  ) {
    return "The estimated delivery Date is not valid, you can't deliver in the past";
  }
  return "valide";
}