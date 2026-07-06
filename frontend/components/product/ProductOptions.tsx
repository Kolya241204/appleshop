async function add() {
    await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            optionId: selected.id,
            quantity: 1,
        }),
    });
}