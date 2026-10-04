from flask import Flask, request, jsonify
from laya import Router

app = Flask(__name__)

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


@app.route("/decision", methods=["POST"])
def decision():

    data = request.json

    state = {
        "customer": {
            "is_student": data["is_student"],
            "previous_orders": data["previous_orders"],
            "previous_returns": data["previous_returns"]
        },

        "cart": {
            "total": data["cart_total"]
        },

        "message": data["message"]
    }

    result = router.predict(state, questions)

    answers = result["answers"]

    response = {
        "promotion": answers["promotion"]["choice"],
        "urgency": answers["urgency"]["score"],
        "manual_review": answers["manual_review"]["noul"] >= 0.5
    }

    return jsonify(response)


if __name__ == "__main__":
    app.run(debug=True)