'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
var _ = require('lodash');

var noteSchema = new mongoose.Schema({
    type:  { 
        type: String,
        enum: ['private', 'public'],
        default: 'private'
    },
    subject: {
        type: String
    }, 
    body: {
        type: String
    },
    dateCreated: {
        type: Date, 
        default: Date.now
    },
    size: {
        type: Number
    },
    lastUpdate: {
        type: Date, 
        default: Date.now
    },
    tags: {
        type: [String]
    },
    trash: {type: Boolean,
        default: false
    }
});

mongoose.model('Note', noteSchema);