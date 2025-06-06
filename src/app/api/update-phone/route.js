import { NextResponse } from "next/server";

export async function POST(req) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  const { phone, countryCode } = await req.json();

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Basic server-side validation for phone and countryCode format
  if (!phone || typeof phone !== 'string' || !/^\d+$/.test(phone)) {
    return NextResponse.json({ message: "Invalid phone number format." }, { status: 400 });
  }
  if (!countryCode || typeof countryCode !== 'string' || !/^\+\d+$/.test(countryCode)) {
    return NextResponse.json({ message: "Invalid country code format. Must start with '+' followed by digits." }, { status: 400 });
  }

  try {
    const formattedPhone = `${countryCode}${phone}`; // Assuming countryCode always present and starts with '+'

    // Consider updating to the latest Shopify API version, e.g., '2024-04'
    const shopifyApiVersion = "2024-04"; 
    
    const response = await fetch(`${process.env.SHOPIFY_STORE_URL}/api/${shopifyApiVersion}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: `
          mutation customerUpdate($customer: CustomerUpdateInput!, $customerAccessToken: String!) {
            customerUpdate(customer: $customer, customerAccessToken: $customerAccessToken) {
              customer {
                id
                phone
              }
              customerUserErrors {
                code
                message
                field
              }
            }
          }
        `,
        variables: {
          customer: {
            phone: formattedPhone,
          },
          customerAccessToken: token,
        },
      }),
    });

    const data = await response.json();

    // Log the full Shopify response for debugging
    // console.log("Shopify customerUpdate response:", JSON.stringify(data, null, 2));

    if (data.errors?.length > 0) {
      // General GraphQL errors (e.g., syntax errors in query, invalid token)
      console.error("Shopify GraphQL errors:", data.errors);
      return NextResponse.json({ 
        message: "Failed to update phone due to GraphQL errors",
        errors: data.errors 
      }, { status: 400 });
    }

    if (data.data?.customerUpdate?.customerUserErrors?.length > 0) {
      // Shopify business logic errors (e.g., invalid phone format detected by Shopify)
      console.error("Shopify customer user errors:", data.data.customerUpdate.customerUserErrors);
      return NextResponse.json({ 
        message: "Failed to update phone",
        errors: data.data.customerUpdate.customerUserErrors 
      }, { status: 400 });
    }
    
    // Check if customer object is returned, indicating success
    if (!data.data?.customerUpdate?.customer?.id) {
        console.error("Shopify update returned no customer ID, potential unknown error:", JSON.stringify(data, null, 2));
        return NextResponse.json({
            message: "Failed to update phone: Shopify did not return a customer ID."
        }, { status: 500 }); // Treat as server error if no specific error but no success object
    }

    return NextResponse.json({ 
      message: "Phone updated successfully",
      phone: data.data.customerUpdate.customer.phone, // Use phone from Shopify response for confirmation
      countryCode // Still return this for client's convenience
    });
  } catch (error) {
    console.error("Internal server error during phone update:", error);
    return NextResponse.json({ 
      message: "Internal server error",
      error: error.message 
    }, { status: 500 });
  }
}