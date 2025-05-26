// /src/app/api/create-shopify-order/route.js
import { createShopifyOrder } from "@/lib/shopify";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      cart,
      email,
      shippingAddress,
      shippingOption, // Changed from shippingLines as per frontend `shippingOption`
      totalAmount,
      paymentMethod, // New: 'prepaid' or 'cod'
      razorpayPaymentId, // For prepaid orders
      razorpayOrderId,   // For prepaid orders
      razorpaySignature  // For prepaid orders
    } = body;

    // Validate required fields
    if (!cart || !email || !shippingAddress || !shippingOption || typeof totalAmount === 'undefined' || !paymentMethod) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields for order creation.",
          required: ["cart", "email", "shippingAddress", "shippingOption", "totalAmount", "paymentMethod"]
        }),
        { status: 400 }
      );
    }

    // Determine Shopify financial_status based on paymentMethod
    let shopifyFinancialStatus;
    if (paymentMethod === "prepaid") {
      shopifyFinancialStatus = 'paid';
      // For prepaid, also check for Razorpay specific IDs
      if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
          return new Response(
              JSON.stringify({ error: "Missing Razorpay payment details for prepaid order." }),
              { status: 400 }
          );
      }
    } else if (paymentMethod === "cod") {
      shopifyFinancialStatus = 'pending';
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid payment method specified." }),
        { status: 400 }
      );
    }

    // Prepare line items with properties for custom measurements
    const lineItems = cart.map(item => {
      if (!item.variantId || !item.quantity) {
        throw new Error("Each cart item must have variantId and quantity.");
      }

      const properties = {};
      // Add customMeasurements as line item properties
      if (item.customMeasurements) {
        // You can add a general note like "Custom Size" if you want
        properties['Size Type'] = "Custom Size";
        for (const key in item.customMeasurements) {
          if (item.customMeasurements.hasOwnProperty(key)) {
            // Capitalize and format the key for Shopify display
            const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            properties[formattedKey] = item.customMeasurements[key];
          }
        }
      } else if (item.size) { // Add standard size as a property for consistency
         properties['Size'] = item.size;
      }
      // You can also add productHandle/title as properties if useful for debugging/display
      // properties['Product Handle'] = item.productHandle;
      // properties['Product Title'] = item.title;


      return {
        variantId: item.variantId,
        quantity: Number(item.quantity),
        // Pass price from frontend if it was calculated there (e.g., for custom products)
        ...(item.price && { price: Number(item.price) }),
        // Conditionally add properties
        ...(Object.keys(properties).length > 0 && { properties: properties })
      };
    });

    // Prepare shipping lines array expected by Shopify
       const shopifyShippingLines = [{
      title: shippingOption.title,
      // Convert price to a number here
      price: parseFloat(shippingOption.price.replace(/[₹,]/g, '')) || 0, // Remove currency symbol and parse
      code: shippingOption.code || 'standard',
      // If your shipping options have a carrierId, pass it here
      ...(shippingOption.carrierId && { carrierId: shippingOption.carrierId })
    }];


    // Create the order payload for createShopifyOrder
    const orderData = {
      email,
      lineItems,
      shippingAddress: {
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        address1: shippingAddress.address1,
        address2: shippingAddress.address2 || '',
        city: shippingAddress.city,
        province: shippingAddress.province,
        country: shippingAddress.country,
        zip: shippingAddress.zip,
        phone: shippingAddress.phone,
        countryCode: shippingAddress.countryCode || 'IN' // Ensure country code is present
      },
      shippingLines: shopifyShippingLines, // Pass the formatted shipping lines
      paymentStatus: shopifyFinancialStatus, // Pass the determined financial status
      totalAmount: totalAmount, // Pass totalAmount for transaction object in createShopifyOrder
      // Include Razorpay details only for prepaid orders
      ...(paymentMethod === "prepaid" && {
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
      }),
      note: `Order created via API - ${paymentMethod === 'prepaid' ? 'Prepaid' : 'COD'}`,
      tags: `api-created, ${paymentMethod}`
    };

    // Create the order using the shopify.js helper
    const order = await createShopifyOrder(orderData);

    // Successful response
    return new Response(
      JSON.stringify({
        success: true,
        orderId: order.id,
        orderNumber: order.order_number,
        confirmationUrl: order.order_status_url
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error("Order Processing Error:", error);

    let status = 500;
    let errorMessage = "Internal Server Error";

    if (error.message.includes("Missing required fields") || error.message.includes("Invalid payment method")) {
      status = 400;
      errorMessage = error.message;
    } else if (error.message.includes("variantId") || error.message.includes("quantity")) {
      status = 400;
      errorMessage = `Invalid cart item data: ${error.message}`;
    } else if (error.message.includes("Shopify API Error")) {
      status = 502; // Bad Gateway
      errorMessage = `Shopify API request failed: ${error.message}`;
    } else if (error.message.includes("Razorpay")) {
      status = 500; // Can be 400 if it's a client-side invalid param
      errorMessage = `Razorpay processing error: ${error.message}`;
    }

    return new Response(
      JSON.stringify({
        error: errorMessage,
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      }),
      {
        status,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}