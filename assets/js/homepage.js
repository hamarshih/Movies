
const logInForm = document.querySelector('.log-in');

logInForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = e.target.querySelector('#user').value;
    const password = e.target.querySelector('#pass').value;
    const body = JSON.stringify({
        username,
        password,
    });

    fetch('/test', {
        method: 'post',
        body,
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(res => res.json())
        .then(json => console.log());
});



// console.log('x', x.value);


// const x = document.getElementById('user');
// const y = document.getElementById('pass');


// function accept() {
//     call();
//     const z = (x.value == "ahmad" && y.value == "123" || "");
//     console.log('z', z);
//     if (z)
//         alert("name and password are right");
//     else {
//         alert("NAME AND PASSWORD AND INCORRECT");
//         console.log("x", x);
//     }
// }

// function call() {
//     console.log('this is x from the "call" function: ', x.value);
//     console.log('this is y from the "call" function: ', y.value);

//     // fetch(`/test2?username=${x.value}&password=${y.value}`)
//     // .then(res=>res.json())
//     // .then(json=>console.log(json))

//     fetch(`/test?username=${x.value}&password=${y.value}`)
//         .then(res => res.json())
//         .then(json => console.log(json));
// }

// document.getElementById('btn').addEventListener('click', call);
// call();