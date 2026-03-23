// General dynamic UI interactions if necessary
document.addEventListener('DOMContentLoaded', function() {
    console.log('EMS UI loaded.');
    var alertList = document.querySelectorAll('.alert');
    alertList.forEach(function (alert) {
        setTimeout(function() {
            var bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });
});
