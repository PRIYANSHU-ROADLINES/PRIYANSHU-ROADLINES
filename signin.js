document.getElementById("continueBtn").addEventListener("click", function () {

    const role = document.querySelector('input[name="role"]:checked').value;

    if (role === "user") {

        window.location.href = "userlogin.html";

    } else {

        window.location.href = "operatorlogin.html";

    }

});
