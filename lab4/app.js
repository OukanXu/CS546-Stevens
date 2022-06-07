const connection = require('./config/mongoConnection');
const bands = require('./data/bands');

const main = async() =>{
    try{
        const first = await bands.create('bandOne', ['Jonh','Allice'],'http://www.123456.com','Hahaha',['1','2','3'],2009);
        console.log(first);
    }catch(e){
        console.log(e);
    }

};

main().catch((e)=>{
    console.log(e);
});