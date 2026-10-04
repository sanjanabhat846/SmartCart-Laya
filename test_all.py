from laya import Router

router = Router()

questions = {
    "promotion": {
        "type": "choice",
        "instructions": "Which promotion should be offered?",
        "criteria": {
            "student_discount": "discount intended for students",
            "loyalty_discount": "discount based on previous purchases",
            "no_discount": "no discount should be offered"
        }
    },

    "urgency": {
        "type": "score",
        "instructions": "How urgent is this customer's order?",
        "criteria": [
            "0", "1", "2", "3", "4",
            "5", "6", "7", "8", "9", "10"
        ]
    },

    "manual_review": {
        "type": "noul",
        "instructions": "Should this order be sent for manual review?"
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