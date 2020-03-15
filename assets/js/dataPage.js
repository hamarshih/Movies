const dataPage = document.querySelector('.data-page');
dataPage.addEventListener('submit', (e) => {
    e.preventDefault();
    const studentId = e.target.querySelector('#id-num').value;   //saving the id here 
    const method = e.target.querySelector('.radio:checked').value;   // deciding which 
    const body = JSON.stringify({
        studentId
    })
    if (method === 'delete') {
        fetch('/api/student', {
            method: 'delete',
            body,
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(json => console.log(json));
    } else {
        fetch(`/api/student?studentId=${studentId}`)
            .then(res => res.json())
            .then(json => console.log(json.info));
    }
})