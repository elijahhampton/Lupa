import stripe from 'tipsi-stripe';

export function initStripe() {
    stripe.setOptions({
        publishableKey: 'pk_live_0qnly0beDBvvr3pkYIL8VYcF00ydAsthgS'
    })
}

/*

{
    "id": "ch_1EZGjoKT40GCfr6OUy7b7xZ6",
    "object": "charge",
    "amount": 100,
    "amount_refunded": 0,
    "application": null,
    "application_fee": null,
    "application_fee_amount": null,
    "balance_transaction": "txn_1EZGjoKT40GCfr6OWAxU4gK3",
    "billing_details": {
        "address": {
            "city": null,
            "country": null,
            "line1": null,
            "line2": null,
            "postal_code": "12312",
            "state": null
        },
        "email": null,
        "name": null,
        "phone": null
    },
    "captured": true,
    "created": 1557663908,
    "currency": "usd",
    "customer": null,
    "description": null,
    "destination": null,
    "dispute": null,
    "failure_code": null,
    "failure_message": null,
    "fraud_details": {},
    "invoice": null,
    "livemode": false,
    "metadata": {},
    "on_behalf_of": null,
    "order": null,
    "outcome": {
        "network_status": "approved_by_network",
        "reason": null,
        "risk_level": "normal",
        "risk_score": 27,
        "seller_message": "Payment complete.",
        "type": "authorized"
    },
    "paid": true,
    "payment_intent": null,
    "payment_method": "src_1EZGjGKT40GCfr6OuqGca9Gy",
    "payment_method_details": {
        "card": {
            "brand": "visa",
            "checks": {
                "address_line1_check": null,
                "address_postal_code_check": "pass",
                "cvc_check": "pass"
            },
            "country": "US",
            "description": "Visa Classic",
            "exp_month": 2,
            "exp_year": 2024,
            "fingerprint": "r1wUCNEWSFD13KQx",
            "funding": "credit",
            "last4": "4242",
            "three_d_secure": null,
            "wallet": null
        },
        "type": "card"
    },
    "receipt_email": null,
    "receipt_number": null,
    "receipt_url": "https://pay.stripe.com/receipts/acct_1EQtQcKT40GCfr6O/ch_1EZGjoKT40GCfr6OUy7b7xZ6/rcpt_F3NUrM5dCDMcI7rySb0QLhR6m5mYGnf",
    "refunded": false,
    "refunds": {
        "object": "list",
        "data": [],
        "has_more": false,
        "total_count": 0,
        "url": "/v1/charges/ch_1EZGjoKT40GCfr6OUy7b7xZ6/refunds"
    },
    "review": null,
    "shipping": null,
    "source": {
        "id": "src_1EZGjGKT40GCfr6OuqGca9Gy",
        "object": "source",
        "amount": null,
        "card": {
            "exp_month": 2,
            "exp_year": 2024,
            "last4": "4242",
            "country": "US",
            "brand": "Visa",
            "address_zip_check": "pass",
            "cvc_check": "pass",
            "funding": "credit",
            "fingerprint": "r1wUCNEWSFD13KQx",
            "three_d_secure": "optional",
            "name": null,
            "address_line1_check": null,
            "tokenization_method": null,
            "dynamic_last4": null
        },
        "client_secret": "src_client_secret_F3NUUwOyZJmX65qyzyVEeN7R",
        "created": 1557663908,
        "currency": null,
        "flow": "none",
        "livemode": false,
        "metadata": {},
        "owner": {
            "address": {
                "city": null,
                "country": null,
                "line1": null,
                "line2": null,
                "postal_code": "12312",
                "state": null
            },
            "email": null,
            "name": null,
            "phone": null,
            "verified_address": null,
            "verified_email": null,
            "verified_name": null,
            "verified_phone": null
        },
        "statement_descriptor": null,
        "status": "consumed",
        "type": "card",
        "usage": "reusable"
    },
    "source_transfer": null,
    "statement_descriptor": null,
    "status": "succeeded",
    "transfer_data": null,
    "transfer_group": null
}

*/