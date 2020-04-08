const Interface = require('../Interface');

class PeopleInterface extends Interface {

    constructor() {
        super();
    }

    async onData(data){
        console.log(data);
    }
}

module.exports = PeopleInterface;
