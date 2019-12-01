/* Please do not remove this line as it prevents the Cannot Find Variable: Buffer error */
//global.Buffer = global.Buffer || require('buffer').Buffer

let UserController = require('../lupa/UserController')
let USER_CONTROLLER = UserController.getInstance();
let WORKOUT_CONTROLLER;

class PacksController {
  private static instance : PacksController;

  private constructor() {

  }

  static getInstance() {
      if (!PacksController.instance) {
          PacksController.instance = new PacksController();
          //One time initializaitons here..
      }

      return PacksController.instance;
  }

  getAllPacks() {
    console.log('Returning all Packs');
    
  }

  getDefaultPacks() {
   
  }

  getPremiumPacks() {

  }

  getGlobalPacks() {

  }

  getPacksByUser = async (username) : Promise<Object> => {
    let packsData = new Array();
    let pack = {
      name: undefined,
      membersByName: [],
      num_members: undefined,
      rating: undefined,
      sessions_completed: undefined,
      timecreated: undefined,
    }
    await Packs.where('membersByName', 'array-contains', username).get().then(res => {
      res.forEach(doc => {
        let data = doc.data();
        pack.name = data.name;
        data.membersByName.forEach(name => {
          pack.membersByName.push(name);
        })
        pack.num_members = data.num_members;
        pack.rating = data.rating;
        pack.sessions_completed = data.sessions_completed;
        pack.timecreated = data.timecreated;
        packsData.push(pack);
      })
    }).catch(err => {
      return Promise.reject(err);
    })
    return Promise.resolve(packsData);
  }

  getPackInformationByName(packName) {

  }

  getPackEvents(packName) {

  }

  isUserInPack() {

  }
}

export default PacksController;