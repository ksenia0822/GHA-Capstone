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
        type: String,
        default: 'Untitled'
    }, 
    body: {
        type: String
    },
    dateCreated: {
        type: Date, 
        default: Date.now
    },

    // AW: what is this for?
    size: {
        type: Number
    },
    lastUpdate: {
        type: Date
    },
    // AW: should this be an enumerated type?
    tags: {
        type: [String]
    },
    trash: {type: Boolean,
        default: false
    }
});


noteSchema.post('save', function() {
  return this.set({lastUpdate: new Date()}).save();
});

// Removing note from Notebook.notes
noteSchema.post('remove', function() {
    return mongoose.model('Notebook')
        .findOneAndUpdate(
            {notes: {$elemMatch: {$eq : this._id}}},
             {$pull: {notes: this._id}})
        .exec();
})


//Add note to trash
// Not sure if will leave trash as a property or as a notebook
// noteSchema.methods.addToTrash = function() {
//     this.set({trash: true}).save();
//     return this;
// }

noteSchema.methods.addTag = function(tag) {
    this.tags.addToSet(tag)
    return this.save()
}

noteSchema.methods.removeTag = function(tag) {
  this.tags.pull(tag)
  return this.save()
}

noteSchema.methods.addToTrash = function() {
    this.set({trash: true})
    return this.save()
}

noteSchema.methods.removeFromTrash = function() {
    this.set({trash: false})
    return this.save()
}

mongoose.model('Note', noteSchema);















