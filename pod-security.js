const operatorLoggedIn =
    localStorage.getItem("loggedIn") === "true";

const role =
    localStorage.getItem("role");

if (!operatorLoggedIn) {

    alert("Please sign in first.");

    window.location.replace("signin.html");

}
else if (
    role !== "staff" &&
    role !== "administrator"
) {

    alert("You are not authorized to access POD.");

    window.location.replace("index.html");

}
