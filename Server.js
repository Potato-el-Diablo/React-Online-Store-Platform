// Load environment variables from the .env file into process.env
require("dotenv").config() //allows automatic deployment of server

// Setup express
const express = require("express")
const app = express()
const cors = require("cors")
app.use(express.json())
app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["POST"], // Add the allowed HTTP methods
        credentials: true, // Allow credentials (cookies, headers with authentication info, etc.)
    })
);

setTimeout(() => {
    console.log("Server stopped automatically after 1 hour.");
    process.exit(0);
}, 3600000);


// Setup Stripe
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)


app.post('/create-checkout-session', async (req, res)=> {
    try { const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: "payment",
        line_items: req.body.items.map(item => {
            return {
                price_data: {
                    currency: "ZAR",
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: item.priceInCents,
                },
                quantity: item.quantity,
            }
        }),
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cart',

    })
        res.json({url: session.url})
    }catch(e) {
        res.status(500).json({error: e.message })
    }
})
// Start up our server on port 5001
app.listen(5001, () => console.log('Server listening on port 5001'));
