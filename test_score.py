from laya import Router

router = Router()

questions = {
    "urgency": {
        "type": "score",
        "instructions": "How urgent is this customer's order?",
        "criteria": [
            "0", "1", "2", "3", "4",
            "5", "6", "7", "8", "9", "10"
        ]
    }
}

customer = {
    "customer": {
        "is_student": True,
        "previous_orders": 12,
        "previous_returns": 1
    },
    "cart": {
        "total": 71500
    },
    "message": "I need this order urgently."
}

result = router.predict(customer, questions)

print(result)