async function handleVerify(method, btn) {
    if (!btn) btn = event.target;
    btn.disabled = true;
    btn.textContent = "Verifying...";

    var result = await verifyIdentity(method);

    if (result && result.credential) {
        btn.outerHTML = '<span class="status-tag status-verified">&#10003; Verified</span>';
        document.getElementById("verifyResult").classList.add("show");
        state.verified = true;
    } else {
        btn.disabled = false;
        btn.textContent = "Verify";
    }
}
