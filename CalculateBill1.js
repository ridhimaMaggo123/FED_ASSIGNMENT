function calculateBill(bill) {
  let totalAmount = 0;
  let billItemsInfo = [];

  bill.billItems.forEach(billItem => {
    // Find the menu item details
    const menuItem = menu.find(m => m.id === billItem.id);

    if (!menuItem) return; // skip if item not found

    // Step 1: base price per piece
    let pricePerPiece = menuItem.rate;

    // Step 2: apply discount (before taxes)
    if (billItem.discount) {
      if (billItem.discount.isInPercent) {
        pricePerPiece -= (pricePerPiece * billItem.discount.rate) / 100;
      } else {
        pricePerPiece -= billItem.discount.rate;
      }
    }

    // Step 3: apply taxes on discounted price
    if (menuItem.taxes) {
      menuItem.taxes.forEach(tax => {
        if (tax.isInPercent) {
          pricePerPiece += (pricePerPiece * tax.rate) / 100;
        } else {
          pricePerPiece += tax.rate;
        }
      });
    }

    // Step 4: total for this item (quantity × price per piece)
    const totalItemAmount = pricePerPiece * billItem.quantity;

    // Step 5: round to 2 decimal places
    const roundedItemAmount = Math.round(totalItemAmount * 100) / 100;
    const roundedPricePerPiece = Math.round(pricePerPiece * 100) / 100;

    // Step 6: add to total bill amount
    totalAmount += roundedItemAmount;

    // Step 7: format bill item info
    billItemsInfo.push(
      `${menuItem.itemName}@${roundedPricePerPiece} x ${billItem.quantity} = ${roundedItemAmount.toFixed(2)}`
    );
  });

  // Round totalAmount to 2 decimal places
  totalAmount = totalAmount.toFixed(2);

  return [parseFloat(totalAmount), billItemsInfo];
}
