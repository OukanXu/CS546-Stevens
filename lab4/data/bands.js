const mongoCollections = require('../config/mongoCollection');
const bands = mongoCollections.bands;
let { ObjectId } = require('mongodb');

function checkExist(name){
    if(!name) throw `No ${name}`;
}

function checkIsStringEmpty(name){
    if(name.trim() == '') throw`${name} cannot be just space`;
    if(typeof name !== 'string') thrwo `${name} must be string`;
    if(name.length == 0) throw `${name} cannot be empty`;
}

function checkWebsite(website){
    if(website.trim() == '') throw`${website} cannot be just space`;
    let website_head = website.substring(0,11);
    let website_tail = website.substring(website.length-4,website.length);
    if(website_head !== 'http://www.' || website_tail !== '.com' || website.length < 20) throw 'Bad website';
}

function checkGenreBandMember(genre){
    if(Object.prototype.toString.call(genre) !== '[object Array]') throw `${genre} must be Array`;
    for(let i in genre){
        if(genre[i].trim() == '') throw`${genre[i]} cannot be just space`;
        if(typeof genre[i] !== 'string') throw `Values in ${genre} must be string`;
        if(genre[i].length === 0) throw`Values in ${genre} cannot be empty`;
    }
}

function checkYearForm(year){
    if(typeof year !== 'number') throw`${yearForm} must be number`;
    if(year < 1900 || year > 2022) throw `${year} is not available`;
}

function checkId(id){
    if(!id) throw 'Must provide a id';
    if(typeof id !== 'string') throw 'Id must be a string';
    if(id.length == 0) throw 'Id cannot be empty';
    if(id.trim() == '') throw 'Id cannot be just space';
    if(!(/^[0-9a-fA-F]{24}$/.test(id))) throw 'Wrong ObjectId';
}

async function create(name,genre, website, recordLabel, bandMenbers, yearFormed){
    checkExist(name);
    checkExist(genre);
    checkExist(website);
    checkExist(recordLabel);
    checkExist(bandMenbers);
    checkExist(yearFormed);

    checkWebsite(website);

    checkGenreBandMember(genre);
    checkGenreBandMember(bandMenbers);

    const bandCollection = await bands();

    let newband = {
        name:name,
        genre:genre,
        website:website,
        recordLabel:recordLabel,
        bandMenbers:bandMenbers,
        yearFormed:yearFormed
    }

    const insertInfo = await bandCollection.insertOne(newband);

    if(insertInfo.insertedCount == 0) throw 'Could not create bands Collection';

    const newId = insertInfo.insertedId.toString();

    const band = await this.get(newId);

    return band;
}


async function getAll(){
    const bandCollection = await bands();

    const bandList = await bandCollection.find({}).toArray();

    return bandList;
}

async function get(id){
    checkId(id);

    let parsedId = ObjectId(id);
    const bandCollection = await bands();
    const res = await bandCollection.findOne({_id: parsedId});
    if(res === null) throw `Cannot find band with ${id}`;

    return res;
}

async function remove(id){
    checkId(id);

    const bandCollection = await bands();

    let parsedId = ObjectId(id);
    let res = await bandCollection.findOne({_id: parsedId});
    if(res == null) throw `Cannot find band with ${id}`;

    const deleteInfo = await bandCollection.deleteOne({_id:parsedId});
    if(deleteInfo.deletedCount === 0){
        throw `Cannot delete band with ${id}`; 
    }
    return `${id} has been successfully deleted!`;
}

module.exports = {
    checkExist,
    checkIsStringEmpty,
    checkGenreBandMember,
    checkYearForm,
    checkId,
    create,
    getAll,
    get,
    remove
}