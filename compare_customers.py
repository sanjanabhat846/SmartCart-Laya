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


customer_a = {
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


customer_b = {
    "customer": {
        "is_student": False,
        "previous_orders": 1,
        "previous_returns": 0
    },
    "cart": {
        "total": 2000
    },
    "message": "Can I get a discount?"
    }


customers = [
    ("Customer A", customer_a),
    ("Customer B", customer_b)
]


for name, state in customers:

    print("\n==============================")
    print(name)
    print("==============================")

    result = router.predict(state, questions)

    answers = result["answers"]

    print("Promotion:", answers["promotion"]["choice"])
    print("Urgency:", answers["urgency"]["score"])
    print("Manual review probability:", answers["manual_review"]["noul"])