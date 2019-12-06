/* Please do not remove this line as it prevents the Cannot Find Variable: Buffer error */
//global.Buffer = global.Buffer || require('buffer').Buffer
import UserController from './UserController';
import PacksController from './PacksController';


let USER_CONTROLLER_INSTANCE;
let PACKS_CONTROLLER_INSTANCE;

export default class LupaController {
    private static _instance : LupaController;

    private constructor() {
      USER_CONTROLLER_INSTANCE = UserController.getInstance();
      PACKS_CONTROLLER_INSTANCE = PacksController.getInstance();
    }

    public static getInstance() {
      if (!LupaController._instance)
      {
        LupaController._instance = new LupaController();
        return LupaController._instance;
      }

      return LupaController._instance;
    }

    /* Algolia */
    indexApplicationData = () => {
      console.log('Indexing all application data');
      USER_CONTROLLER_INSTANCE.indexUsersIntoAlgolia();
      PACKS_CONTROLLER_INSTANCE.indexPacksIntoAlgolia();
    }

    indexUsers = async () => {
      await  USER_CONTROLLER_INSTANCE.indexUsersIntoAlgolia();
    }

    indexPacks = async() => {
      await PACKS_CONTROLLER_INSTANCE.indexPacksIntoAlgolia();
    }

    /* User Functions */
    searchUserByPersonalName = async (searchQuery='') => {
      let arr;
      await USER_CONTROLLER_INSTANCE.searchByRealName(searchQuery).then(objs => {
        arr = objs;
      })
      return arr;
    }

    /* Pack Functions */
    getDefaultPacks = async ()  => {
      return Promise.resolve(true);
      //await Promise.resolve(PACKS_CONTROLLER.getDefaultPacks());
    }

    getPacksByUser = () => {
      
    }
}