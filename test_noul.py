from laya import Router

router = Router()

questions = {
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