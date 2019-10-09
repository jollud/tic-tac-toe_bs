function checkQueue () {
    console.log(123);
    let xhttp = new XMLHttpRequest();
    xhttp.open('GET', '/ttt_mult_queue/check', true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            if (this.responseText === 'success') {
                window.location.replace('/ttt_mult');
            }
        }
    }
    }

let index = setInterval(checkQueue, 2000);

window.addEventListener('beforeunload',  function () {
    let xhttp = new XMLHttpRequest();
    xhttp.open('GET', 'ttt_mult_queue/leave', true);
    xhttp.send();
});
