const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const stripe = Stripe('sk_test_adsfafasf'); // Replace with your Stripe secret key

app.use(cors());
app.use(bodyParser.json());

// API to create a customer and SetupIntent
app.post('/create-customer-setup-intent', async (req, res) => {
  try {
    const { email } = req.body;

    // Create a new customer
    const customer = await stripe.customers.create({
      email: email,
    });

    console.log("created customer:", customer);

    // Create a SetupIntent for the customer
    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      payment_method_types: ['card'],
    });

    res.send({
      clientSecret: setupIntent.client_secret,
      customerId: customer.id,
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// API to create an Invoice
app.post('/create-invoice', async (req, res) => {
    console.log("creating invoice");
  const { customerId, paymentMethodId, amount, description } = req.body;

  try {
    // Attach the payment method to the customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Set the default payment method for the customer
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Create the Invoice
    const invoice = await stripe.invoices.create({
      customer: customerId,
      auto_advance: true, // Automatically finalize and attempt payment
    });

     // Create an InvoiceItem
     const invoiceItem = await stripe.invoiceItems.create({
        customer: customerId,
        amount: amount,
        currency: 'usd',
        description: description,
        invoice: invoice.id,
      });

    res.send(invoice);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.post('/send-receipt', async (req, res) => {
    try {
        const { invoiceId } = req.body;

        // Finalize and pay the invoice
        const invoice = await stripe.invoices.finalizeInvoice(invoiceId);

        console.log("invoice:", invoice);
        // Optionally send a receipt
        if (invoice.paid) {
            await stripe.invoices.sendInvoice(invoiceId);
        }

        const paidInvoice = await stripe.invoices.pay(invoice.id);
        console.log(paidInvoice);
        res.send({ message: 'Receipt sent!' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});