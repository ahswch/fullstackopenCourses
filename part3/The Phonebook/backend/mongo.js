const mongoose = require('mongoose')

// eslint-disable-next-line no-undef
if (process.argv.length < 3) {
    console.log(
        'Please provide the password as an argument: node mongo.js <password>'
    )
    // eslint-disable-next-line no-undef
    process.exit(1)
}

// eslint-disable-next-line no-undef
const password = process.argv[2]

const url = `mongodb+srv://data1:${password}@cluster0.laymp.mongodb.net/phonebook-app?retryWrites=true`

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
})

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)
// eslint-disable-next-line no-undef
if (process.argv[3] && process.argv[4]) {
    const person = new Person({
        // eslint-disable-next-line no-undef
        name: process.argv[3],
        // eslint-disable-next-line no-undef
        number: process.argv[4],
    })

    // eslint-disable-next-line no-unused-vars
    person.save().then((result) => {
        console.log(
            `added ${person.name} number ${person.number} to phonebook`
        )
        mongoose.connection.close()
    }).catch(err => {
        console.log(err)
    })
} else {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(p => {
            console.log(`${p.name} ${p.number}`)
        })
        mongoose.connection.close()
    })
}
