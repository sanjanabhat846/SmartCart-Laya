from laya import Router

router = Router()

# Same decision for every customer
questions = {
    "promotion": {
        "type": "choice",
        "instructions": "Which promotion should be offered?",
        "criteria": {
            "student_discount": "discount intended for students",
            "loyalty_discount": "discount based on previous purchases",
            "no_discount": "no discount should be offered"
        }
    }
}


# -----------------------------
# Customer 1
# -----------------------------
customer_1 = {
    "customer": {
        "is_student": True,
        "previous_orders": 12,
        "previous_returns": 1
    },
    "cart": {
        "total": 71500
    },
    "message": "I am a student. Can I get a discount?"
}


# -----------------------------
# Customer 2
# -----------------------------
customer_2 = {
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


# -----------------------------
# Customer 3
# -----------------------------
customer_3 = {
    "customer": {
        "is_student": False,
        "previous_orders": 20,
        "previous_returns": 0
    },
    "cart": {
        "total": 80000
    },
    "message": "I am a regular customer. Do I get any discount?"
}


customers = [
    ("Customer 1", customer_1),
    ("Customer 2", customer_2),
    ("Customer 3", customer_3)
]


# Run Laya for each customer
for name, state in customers:

    print("\n==============================")
    print(name)
    print("==============================")

    result = router.predict(state, questions)

    answer = result["answers"]["promotion"]

    print("Selected promotion:", answer["choice"])
    print("Probabilities:", answer["probabilities"])
    print("Answer probability:", answer["answer_confidence"])