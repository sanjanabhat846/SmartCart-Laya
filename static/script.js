/**
 * SmartCart - AI Shopping Decision Assistant Frontend Script
 * Interacts with the Flask /decision endpoint to display Laya predictive outputs.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("SmartCart frontend initialized.");
});

/**
 * Handle form submission and send decision payload to backend REST API
 */
async function handleAnalyze(event) {
    event.preventDefault();

    // DOM Elements
    const analyzeBtn = document.getElementById('analyzeBtn');
    const btnContent = analyzeBtn.querySelector('.btn-content');
    const btnSpinner = analyzeBtn.querySelector('.btn-spinner');

    const emptyState = document.getElementById('emptyState');
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const resultsContent = document.getElementById('resultsContent');
    const statusBadge = document.getElementById('statusBadge');

    // 1. Collect and parse form input values
    const isStudent = document.getElementById('isStudent').checked;
    const previousOrders = parseInt(document.getElementById('previousOrders').value, 10) || 0;
    const previousReturns = parseInt(document.getElementById('previousReturns').value, 10) || 0;
    const cartTotal = parseFloat(document.getElementById('cartTotal').value) || 0;
    const message = document.getElementById('customerMessage').value.trim();

    // Construct backend payload format expected by app.py
    const payload = {
        is_student: isStudent,
        previous_orders: previousOrders,
        previous_returns: previousReturns,
        cart_total: cartTotal,
        message: message
    };

    console.log("Sending decision request to Flask /decision:", payload);

    // 2. Set UI Loading State
    analyzeBtn.disabled = true;
    btnContent.classList.add('hidden');
    btnSpinner.classList.remove('hidden');

    emptyState.classList.add('hidden');
    errorState.classList.add('hidden');
    resultsContent.classList.add('hidden');
    loadingState.classList.remove('hidden');

    statusBadge.className = 'status-pill status-ready';
    statusBadge.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...';

    try {
        // 3. Perform POST request to Flask /decision endpoint
        const response = await fetch('/decision', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Server returned HTTP status ${response.status} (${response.statusText})`);
        }

        const data = await response.json();
        console.log("Received response from Laya backend:", data);

        // 4. Render the returned Laya decisions
        renderResults(data);

        // Hide loader & show results
        loadingState.classList.add('hidden');
        resultsContent.classList.remove('hidden');

        statusBadge.className = 'status-pill status-active';
        statusBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Decision Ready';

    } catch (err) {
        console.error("Error communicating with Laya backend:", err);

        // Render graceful error state
        loadingState.classList.add('hidden');
        errorState.classList.remove('hidden');

        document.getElementById('errorTitle').textContent = "Decision Request Failed";
        document.getElementById('errorMessage').textContent = err.message || "Could not reach the Flask server. Please ensure the backend is running.";

        statusBadge.className = 'status-pill status-ready';
        statusBadge.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Error';

    } finally {
        // Restore button state
        analyzeBtn.disabled = false;
        btnContent.classList.remove('hidden');
        btnSpinner.classList.add('hidden');
    }
}

/**
 * Render decisions returned by Laya into readable labels and UI elements
 */
function renderResults(data) {
    // --- 1. PROMOTION DECISION ---
    const rawPromo = data.promotion || 'no_discount';
    const promoValueEl = document.getElementById('promoValue');
    const promoTextEl = document.getElementById('promoText');
    const promoIconEl = document.getElementById('promoIcon');
    const promoMetaEl = document.getElementById('promoMeta');

    // Convert technical names into human-readable labels & styled badges
    let promoLabel = "No Discount";
    let promoClass = "promo-none";
    let promoIconClass = "fa-solid fa-ban";
    let promoMeta = "No promotional discount applies for this order criteria.";

    if (rawPromo === 'student_discount') {
        promoLabel = "Student Discount";
        promoClass = "promo-student";
        promoIconClass = "fa-solid fa-graduation-cap";
        promoMeta = "Special pricing granted based on verified student status.";
    } else if (rawPromo === 'loyalty_discount') {
        promoLabel = "Loyalty Discount";
        promoClass = "promo-loyalty";
        promoIconClass = "fa-solid fa-award";
        promoMeta = "Reward discount offered due to customer order history.";
    } else if (rawPromo !== 'no_discount') {
        // Fallback formatting for any unexpected string choice
        promoLabel = rawPromo.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        promoClass = "promo-student";
        promoIconClass = "fa-solid fa-tag";
        promoMeta = `Laya selected ${promoLabel}.`;
    }

    promoTextEl.textContent = promoLabel;
    promoValueEl.className = `promo-badge ${promoClass}`;
    promoIconEl.className = promoIconClass;
    promoMetaEl.textContent = promoMeta;

    // --- 2. URGENCY DECISION ---
    const rawUrgency = parseFloat(data.urgency);
    const urgencyScore = isNaN(rawUrgency) ? 0 : rawUrgency;
    const urgencyScoreTextEl = document.getElementById('urgencyScoreText');
    const urgencyBarEl = document.getElementById('urgencyBar');
    const urgencyMetaEl = document.getElementById('urgencyMeta');

    // Format score to 1-2 decimal places if non-integer
    const formattedScore = Number.isInteger(urgencyScore) ? urgencyScore.toString() : urgencyScore.toFixed(2);
    urgencyScoreTextEl.textContent = `${formattedScore} / 10`;

    // Map 0-10 scale to percentage (0% to 100%)
    const clampedScore = Math.min(Math.max(urgencyScore, 0), 10);
    const percentage = (clampedScore / 10) * 100;
    urgencyBarEl.style.width = `${percentage}%`;

    if (urgencyScore >= 7.5) {
        urgencyMetaEl.textContent = "High urgency detected in customer request. Prioritized fulfillment recommended.";
    } else if (urgencyScore >= 4.0) {
        urgencyMetaEl.textContent = "Moderate urgency score assigned based on order message context.";
    } else {
        urgencyMetaEl.textContent = "Standard fulfillment timeline suitable for this order.";
    }

    // --- 3. MANUAL REVIEW DECISION ---
    const isManualReview = Boolean(data.manual_review);
    const reviewBadgeEl = document.getElementById('reviewBadge');
    const reviewTextEl = document.getElementById('reviewText');
    const reviewIconEl = document.getElementById('reviewIcon');
    const reviewExplanationEl = document.getElementById('reviewExplanation');

    if (isManualReview) {
        reviewTextEl.textContent = "YES";
        reviewBadgeEl.className = "review-badge review-yes";
        reviewIconEl.className = "fa-solid fa-triangle-exclamation";
        reviewExplanationEl.textContent = "Flagged for manual compliance or fraud check.";
    } else {
        reviewTextEl.textContent = "NO";
        reviewBadgeEl.className = "review-badge review-no";
        reviewIconEl.className = "fa-solid fa-circle-check";
        reviewExplanationEl.textContent = "Order satisfies automated processing criteria.";
    }
}

/**
 * Apply sample preset values to the form for quick testing
 */
function applyPreset(type) {
    const isStudentInput = document.getElementById('isStudent');
    const ordersInput = document.getElementById('previousOrders');
    const returnsInput = document.getElementById('previousReturns');
    const totalInput = document.getElementById('cartTotal');
    const messageInput = document.getElementById('customerMessage');

    if (type === 'student') {
        isStudentInput.checked = true;
        ordersInput.value = 3;
        returnsInput.value = 0;
        totalInput.value = "85.00";
        messageInput.value = "I need this textbook order urgently before my exam tomorrow! Can I get a student discount?";
    } else if (type === 'loyalty') {
        isStudentInput.checked = false;
        ordersInput.value = 45;
        returnsInput.value = 1;
        totalInput.value = "320.50";
        messageInput.value = "Regular customer placing my monthly order. Hoping for a loyalty reward on this large cart!";
    } else if (type === 'standard') {
        isStudentInput.checked = false;
        ordersInput.value = 2;
        returnsInput.value = 0;
        totalInput.value = "45.00";
        messageInput.value = "Checking out standard household items.";
    }
}
