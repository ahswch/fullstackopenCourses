const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URL

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true})
    // eslint-disable-next-line no-unused-vars
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        unique: true
    },
    number: {
        type: String,
        validate: {
            validator: function(v) {
                return /\d{8}\d*/.test(v)
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: true
    },
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
// if (process.argv[3] && process.argv[4]) {
//     const person = new Person({
//         name: process.argv[3],
//         number: process.argv[4],
//     });

//     person.save().then((result) => {
//         console.log(
//             `added ${person.name} number ${person.number} to phonebook`
//         );
//         mongoose.connection.close();
//     }).catch(err => {
//         console.log(err)
//     });
// } else {
//     Person.find({}).then(result => {
//         console.log('phonebook:')
//         result.forEach(p => {
//             console.log(`${p.name} ${p.number}`)
//         })
//         mongoose.connection.close()
//     })
// }

