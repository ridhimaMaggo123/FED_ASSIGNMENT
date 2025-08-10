  // ---------- Sample Data ----------
const Items = [
  {
    id: "item1",
    itemName: "Butter Roti",
    rate: 20,
    taxes: [
      {
        name: "Service Charge",
        rate: 10,
        isInPercent: "Y"
      }
    ],
    category: { categoryId: "C2" }
  },
  {
    id: "item2",
    itemName: "Paneer Butter Masala",
    rate: 150,
    taxes: [
      {
        name: "Service Charge",
        rate: 10,
        isInPercent: "Y"
      }
    ],
    category: { categoryId: "C1" }
  }
];

const Categories = [
  {
    id: "C1",
    categoryName: "Platters",
    superCategory: { superCategoryName: "South Indian", id: "SC1" }
  },
  {
    id: "C2",
    categoryName: "Breads",
    superCategory: { superCategoryName: "North Indian", id: "SC2" }
  }
];

const bill = {
  id: "B1",
  billNumber: 1,
  opentime: "06 Nov 2020 14:19",
  customerName: "CodeQuotient",
  billItems: [
    {
      id: "item2",
      quantity: 3,
      discount: { rate: 10, isInPercent: "Y" }
    },
    {
      id: "item1",
      quantity: 5,
      discount: { rate: 0, isInPercent: "Y" }
    }
  ]
};

// ---------- Combined Function ----------
function buildBill(bill, Items, Categories, detailed = false) {
  let totalAmount = 0;

  const billItemsProcessed = bill.billItems.map(bi => {
    const item = Items.find(it => it.id === bi.id);
    const category = Categories.find(cat => cat.id === item.category.categoryId);

    const basicData = {
      id: bi.id,
      name: item ? item.itemName : "",
      quantity: bi.quantity
    };

    if (!detailed) {
      return basicData; // Task 1 output
    }

    // ---------- Detailed Calculations ----------
    let baseAmount = item.rate * bi.quantity;

    // Apply discount
    let discountAmount = 0;
    if (bi.discount) {
      discountAmount = bi.discount.isInPercent === "Y"
        ? (baseAmount * bi.discount.rate) / 100
        : bi.discount.rate;
    }
    let afterDiscount = baseAmount - discountAmount;

    // Apply taxes
    let taxAmount = 0;
    if (item.taxes) {
      item.taxes.forEach(tax => {
        if (tax.isInPercent === "Y") {
          taxAmount += (afterDiscount * tax.rate) / 100;
        } else {
          taxAmount += tax.rate;
        }
      });
    }

    let finalAmount = afterDiscount + taxAmount;
    totalAmount += finalAmount;

    return {
      ...basicData,
      discount: bi.discount,
      taxes: item.taxes,
      amount: finalAmount,
      superCategoryName: category ? category.superCategory.superCategoryName : "",
      categoryName: category ? category.categoryName : ""
    };
  });

  const result = {
    id: bill.id,
    billNumber: bill.billNumber,
    opentime: bill.opentime,
    customerName: bill.customerName,
    billItems: billItemsProcessed
  };

  if (detailed) {
    result["Total Amount"] = totalAmount;
  }

  return result;
}

// ---------- Usage ----------
// Task 1 (basic)
console.log(buildBill(bill, Items, Categories, false));

// Task 2 (detailed)
console.log(buildBill(bill, Items, Categories, true));
