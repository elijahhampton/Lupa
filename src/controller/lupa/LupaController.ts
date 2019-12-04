/* Please do not remove this line as it prevents the Cannot Find Variable: Buffer error */
//global.Buffer = global.Buffer || require('buffer').Buffer
import UserController from './UserController';
import PacksController from './PacksController';


var USER_CONTROLLER_INSTANCE = UserController.getInstance();
//var PACKS_CONTROLLER_INSTANCE = PacksController.getInstance();


export default class LupaController {
    private static _instance : LupaController;

    private constructor() {

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
    indexUsers = async () => {
      await  USER_CONTROLLER_INSTANCE.indexUsersIntoAlgolia();
    }

    /* User Functions */
    registerUser = async(usernameIn, passwordIn, confirmedPassword) : Promise<Boolean> => {
      let result = await USER_CONTROLLER_INSTANCE.addUserToDatabase(usernameIn, passwordIn);
      console.log(result);
      return Promise.resolve(result);
    }

    loginUser = async (usernameIn, passwordIn) : Promise<Boolean> => 
    {
      if (usernameIn == null || usernameIn == '' || usernameIn == undefined || passwordIn == null 
        || passwordIn == '' || passwordIn == undefined)
      {
        return Promise.reject('Invalid Input Parameters');
      }

      let loginResult = await USER_CONTROLLER_INSTANCE.login(usernameIn, passwordIn);

      return Promise.resolve(loginResult);
    }

    getCurrUser() {
      return USER_CONTROLLER_INSTANCE.getCurrentUserInformation();
    }

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

    getPacksByUser = async (usernameIn) => {
      return Promise.resolve(true);
      //await Promise.resolve(PACKS_CONTROLLER.getPacksByUser(usernameIn));
    }
}