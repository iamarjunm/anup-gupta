// /src/app/api/checkout/route.js
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Helper for validation
function validateRequestData({ cart, email, shippingAddress, totalAmount, paymentMethod }) {
  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    throw new Error("Invalid cart items.");
  }

  if (typeof totalAmount !== "number" || totalAmount <= 0) {
    throw new Error("Invalid amount.");
  }

  // Ensure paymentMethod is present and valid
  if (!paymentMethod || !['prepaid', 'cod'].includes(paymentMethod)) {
      throw new Error("Invalid or missing payment method.");
  }

  // Only validate email and shipping address for prepaid as Razorpay needs them
  if (paymentMethod === 'prepaid') {
      if (!email) throw new Error("Email is required for prepaid payment.");
      if (!shippingAddress || !shippingAddress.phone) throw new Error("Shipping address phone number is required for prepaid payment.");
  }
}

export async function POST(req) {
  try {
    const requestData = await req.json();
    validateRequestData(requestData);

    const { cart, email, shippingAddress, totalAmount, paymentMethod, shippingOption } = requestData;

    // Only create a Razorpay order if payment method is prepaid
    if (paymentMethod === "prepaid") {
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(totalAmount * 100), // Razorpay expects amount in paise
        currency: "INR",
        receipt: `order_${Date.now()}`,
        notes: {
          email: email || "N/A", // Provide default for notes if not always present
          customer_name: `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim(),
          phone: shippingAddress.phone || "N/A",
          shipping_address_line1: shippingAddress.address1,
          shipping_address_city: shippingAddress.city,
          shipping_method: shippingOption?.title || 'N/A', // Store shipping method
          cart_items_summary: cart.map(item => `${item.title || 'Product'} x${item.quantity}`).join(', '), // Summary of cart
          // You could also store JSON.stringify(cart) if you need full details for debugging
        },
      });

      return new Response(
        JSON.stringify({
          success: true,
          orderId: razorpayOrder.id, // This is the Razorpay order ID
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else if (paymentMethod === "cod") {
      // For COD, we don't create a Razorpay order here.
      // The frontend will directly call /api/create-shopify-order.
      return new Response(
        JSON.stringify({
          success: true,
          message: "No Razorpay order created for COD.",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

  } catch (error) {
    console.error("Error in payment processing (/api/checkout):", error.message);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Payment processing failed",
      }),
      {
        status: error instanceof TypeError ? 400 : 500, // 400 for bad client data, 500 for server issues
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}