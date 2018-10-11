var faker = require('faker')

/* User can add employee on same page with employee

name,email Id,address,designation,mobile number,employee photo with proper validation. */

var employees = []

var Employe = function(){
    this.name = faker.name.findName(),
    this.emailId = faker.internet.email(),
    this.address = faker.address.streetName() + ", " + faker.address.streetAddress() +", " + faker.address.city() +" ,"+ faker.address.state() + ", " +faker.address.zipCode(),
    this.designation = faker.name.jobTitle(),
    this.phoneNumber = faker.phone.phoneNumber(),
    this.empPhoto = "https://loremflickr.com/150/100/people"

}

for(var i=0; i<5; i++){
    let emp = new Employe()
    employees.push(emp)
}

module.exports = employees