const express = require('express');
const path = require('path');
const app = express();
const serverName = "ahmad";
const serverPass = "123";
const fetch = require('node-fetch');
app.use(express.json());
const mongoose = require('mongoose');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './views'));
app.use('/assets/js', express.static(path.resolve(__dirname, '../assets/js')));
app.use('/assets/css', express.static(path.resolve(__dirname, '../assets/css')));
app.use('/assets/src', express.static(path.resolve(__dirname, '../assets/src')));

mongoose.connect('mongodb://localhost/testdb', {
    useUnifiedTopology: true,
    useNewUrlParser: true, useFindAndModify: false
});

mongoose.connection.once('open', function () {
    console.log('Connected Successfuly');
}).on('error', function (error) {
    console.log('connection error : ', error);
});


const Schema = mongoose.Schema;
const moviesSchema = new Schema({
    popularity: Number,
    vote_count: Number,
    video: Boolean,
    poster_path: String,
    id: Number,
    adult: Boolean,
    backdrop_path: String,
    original_language: String,
    original_title: String,
    genre_ids: Array,
    title: String,
    vote_average: Number,
    overview: String,
    release_date: Date
})

const movie = mongoose.model('movie', moviesSchema);

module.exports = movie;



app.use('/students', (req, res, next) => {
    res.render('dataPage');
})
app.use('/modifying', (req, res, next) => {
    res.render('modifying');
})
app.get('/', (req, res, next) => {
    res.render('homepage', {
        items: [1, 2, 3, 4, 5, 6, 7, 8]
    })
});


app.get('/', (req, res, next) => {
    res.render('homepage', {
        items: [1, 2, 3, 4, 5, 6, 7, 8]
    })
});

app.get('/db-test', async () => {
    await dbTest();
})

// app.post('/test2', (req, res, next) => {
//     const username = req.username;
//     const password = req.password;
//     if (serverName === username && serverPass == password) {
//         res.json('success');
//     } else {
//         res.json('fail');
//     }
// })

app.get('/test', (req, res, next) => {
    const username = req.query.username;
    const password = req.query.password;

    if (serverName === username && serverPass == password) {
        res.json('success');
    } else {
        res.json('fail');
    }
});

app.post('/test', (req, res, next) => {
    // const username = req.body.username;
    // const password = req.body.password;
    console.log('req', req.body);
    res.json({});
    // if (serverName === username && serverPass == password) {
    //     res.json('success');
    // } else {
    //     res.json('fail');
    // }
});



app.listen(3000, () => console.log('listening on port 3000'))







// res.render('movies', {
//     movies: data.results
// })

//res.json(data.results[0].backdrop_path); //   "https://image.tmdb.org/t/p/w500

//res.json(data.results);
//console.log(data);

//-------------------------------------------------------------------------------------------------------
//                          ###########################################################



// Fetching the data from the API and displaying it with option paging     
app.get('/movies', async (req, res) => {
    const page = (req.query || {}).page || 1;
    const pendingData = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=da100bbbbcce2fc085fece7dc360c632&language=en-US&page=${page}`);
    const data = await pendingData.json();
    const s = data.results;
    res.render('movies', {
        movies: data.results,
        page__num: page
    });
})

// Fetching the movie data from the API and storing it's data in the database    
app.get('/send', async (req, res) => {
    const title = (req.query || {}).title || "A Rainy Day in New York";
    for (var i = 1; i <= 100; i++) {
        const pendingData = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=da100bbbbcce2fc085fece7dc360c632&language=en-US&page=${i}`);
        const data = await pendingData.json();
        const dataRes = data.results;

        dataRes.forEach((item) => {
            if (title == item.title) {

                const Movie = new movie({
                    popularity: item.popularity,
                    vote_count: item.vote_count,
                    video: item.video,
                    poster_path: item.poster_path,
                    id: item.id,
                    adult: item.adult,
                    backdrop_path: item.backdrop_path,
                    original_language: item.original_language,
                    original_title: item.original_title,
                    genre_ids: item.genre_ids,
                    title: item.title,
                    vote_average: item.vote_average,
                    overview: item.overview,
                    release_date: item.release_date
                });
                res.render('send', {
                    movie: item
                });
                Movie.save();
            }
        })
    }
})

// Finding a movie from the ((database)) by sending the title in the url                       
app.get('/send', async (req, res) => {
    const titles = (req.query || {}).title || "A Rainy Day in New York";
    movie.findOne({ title: `${titles}` }, (err, info) => {
        if (err) {
            return console.log(err);
        } else {
            res.render('send', {
                movie: info
            })
        }
    })
})

/* Updating a movie in the database by sending it's title in the body with the new data, if doesn't exist then add a new element.
   There could be a better implementation by adding a foreach to the "body" then every loop create a variable and update 
it's data( instead of creating only static things to update)                                                                                                    */
app.put('/send', async (req, res, next) => {
    const matchingTitle = req.body.title;
    const adult = req.body.adult;
    const original_language = req.body.original_language;
    const id = req.body.id;
    const genre_ids = req.body.genre_ids;
    console.log('req: ', `"${matchingTitle}"`);
    res.json({});
    console.log('movie.findOneAndUpdate', await movie.findOne({ title: `${matchingTitle}` }));
    await movie.findOneAndUpdate({ title: `${matchingTitle}` }, { $set: { genre_ids: `${genre_ids}`, adult: `${adult}`, original_language: `${original_language}`, id: `${id}` } }, { upsert: true });
    console.log('Should Be Updated');
})


// Deleting elements from the database by sending it's title in the body                  
app.delete('/send', async (req, res, next) => {
    const matchingTitle = req.body.title;
    console.log('req: ', `"${matchingTitle}"`);
    res.json({});
    await movie.findOneAndDelete({ title: `${matchingTitle}` });
    console.log('Should Be Deleted');
})



//-------------------------------------------------------------------------------------------------------
//                          ###########################################################




const studentSchema = new Schema({
    studentId: { type: Number, unique: true },
    name: String,
    age: Number,
    parents: {
        mom: String,
        dad: String
    }
})

const students = mongoose.model('students', studentSchema);

module.exports = students;

// inserting or updating student's info in the database 
app.put('/api/student', async (req, res, next) => {
    const name = req.body.stuName;
    const age = req.body.stuAge;
    const father = req.body.father;
    const mother = req.body.mother;
    const studentId = req.body.studentId;
    students.find({ studentId: studentId }, (err, data) => {  //if the student doesn't exist then there won't be any modification
        if (err) {
            return console.log(err);
        } else if (data.length < 1) {

            res.json("this student doesn't exist");
        } else {
            students.findOneAndUpdate({ studentId: `${studentId}` }, { $set: { name: `${name}`, age: `${age}`, parents: { mom: `${mother}`, dad: `${father}` } } }, (err, info) => {
                if (err) {
                    return console.log(err);
                } else {
                    res.json( "Students data updated successfully" );
                }
            });
        }
    })
})

//Adding new student to the database
app.post('/api/student', async (req, res, next) => {
    const name = req.body.stuName;
    const age = req.body.stuAge;
    const father = req.body.father;
    const mother = req.body.mother;
    const studentId = req.body.studentId;
    await students.find({ studentId: studentId }, (err, data) => { // checking if the student is in the database, if yes then there won't be any insertion
        if (err) {
            return console.log(err);
        } else if (data.length > 0) {
            res.json("this student does exist")
        } else {
            students.insertMany({ studentId: `${studentId}`, name: `${name}`, age: `${age}`, parents: { mom: `${mother}`, dad: `${father}` } }, (err, info) => {
                if (err) {
                    return console.log(err);
                } else {
                    res.json("Student Inserted to the database successfuly ");
                }
            });
        }
    });
})

// fetching student info from the database 
app.get('/api/student', async (req, res) => {
    const id = (req.query || {}).studentId || 1;
    students.findOne({ studentId: `${id}` }, (err, info) => {
        if (err) {
            return console.log(err);
        } else {
            res.json({ info });
        }
    })
})

// Deleting student's info from the database
app.delete('/api/student', async (req, res, next) => {
    const id = req.body.studentId;
    students.findOneAndDelete({ studentId: `${id}` }, (err, info) => {
        if (err) {
            return console.log(err);
        } else {
            // res.json({ info });
            res.json("Students data are deleted successfully");
        }
    });
});
