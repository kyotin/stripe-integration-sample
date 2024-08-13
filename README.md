# Introdution
This repo is used for create setupIntent, then issue invoice, and pay the invoice immediately

# How to run
For `index.html` just open it directly at Browser
For `server.js` need: 
```
npm install express stripe
```
Then
```
node server.js
```

# How it work
Via FE page at your browser, it will support you to create customer, setupIntent.
Then via curl (or postman), you can do 
### Create invoice
```
curl --location 'http://localhost:3000/create-invoice' \
--header 'Content-Type: application/json' \
--data '{
  "customerId": "cus_Qeg16aQHx8Yxdx",
  "paymentMethodId": "pm_1PnMfRC07F3DptR08WGkupoA",
  "amount": 5000,
  "description": "Service test"
}'
```
### Make a payment via invoice
```
curl --location 'http://localhost:3000/create-invoice' \
--header 'Content-Type: application/json' \
--data '{
  "customerId": "cus_Qeg16aQHx8Yxdx",
  "paymentMethodId": "pm_1PnMfRC07F3DptR08WGkupoA",
  "amount": 5000,
  "description": "Fucking Nghia'\''s Ass"
}'
```
