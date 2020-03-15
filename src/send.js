const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moviesSchema= new Schema({
    popularity:Number,
    vote_count:Number,
    video:Boolean,
    poster_path:String,
    id:Number,
    adult:Boolean,
    backdrop_path:String,
    original_language:String,
    original_title:String,
    genre_ids:Array,
    title:String,
    vote_average:Number,
    overview:String,
    release_date:Date


});

module.exports = moviesSchema;
