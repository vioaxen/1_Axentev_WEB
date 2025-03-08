document.getElementById("game").addEventListener("click", function () {
    
    let money = 200;
    let cart = [];

    alert(`Добро пожаловать в магазин! У вас есть ${money} монет.`);
    
    const products = [
        { name: "Яблоко", price: 20 },
        { name: "Шоколад", price: 50 },
        { name: "Молоко", price: 30 }
    ];

    while (money > 0) {
        let productList = "Выберите товар для покупки:\n";
        products.forEach((product, index) => {
            productList += `${index + 1}. ${product.name} - ${product.price} монет\n`;
        });
        productList += "Введите 0, чтобы выйти.";

        let choice = prompt(productList);

        if (choice === null || choice === "0") {
            break;
        }

        let productIndex = parseInt(choice, 10) - 1;
        if (isNaN(productIndex) || productIndex < 0 || productIndex >= products.length) {
            alert("Ошибка! Введите правильный номер товара.");
            continue;
        }

        let selectedProduct = products[productIndex];

        let wantsToBuy = confirm(`Вы уверены, что хотите купить ${selectedProduct.name} за ${selectedProduct.price} монет?`);

        if (wantsToBuy) {
            if (money >= selectedProduct.price) {
                money -= selectedProduct.price;
                cart.push(selectedProduct.name);
                alert(`Вы купили ${selectedProduct.name}! Остаток монет: ${money}`);
            } else {
                alert("Недостаточно денег для покупки!");
            }
        }
    }

    if (money <= 0) {
        alert("У вас закончились монеты!");
    }

    if (cart.length > 0) {
        alert("Ваши покупки: " + cart.join(", "));
    }

    alert("Спасибо за покупки! Ваш итоговый баланс: " + money + " монет.");
});