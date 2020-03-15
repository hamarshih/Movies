const stuInfo = document.querySelector(".stu-info");
console.log('-----------');
stuInfo.addEventListener('submit', (e) => {
    e.preventDefault();
    const studentId = e.target.querySelector('#stu-id').value;
    const stuName = e.target.querySelector('#stu-name').value;
    const stuAge = e.target.querySelector('#stu-age').value;
    const father = e.target.querySelector('#stu-dad').value;
    const mother = e.target.querySelector('#stu-mom').value;
    const method = e.target.querySelector('.rad:checked').value
    const body = JSON.stringify({
        studentId,
        stuName,
        stuAge,
        father,
        mother
    })

    fetch('/api/student', {
        method,
        body,
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(json => console.log(json))
})