const { StatusCodes } = require('http-status-codes');
const { Logger } = require('../config');
const AppError = require('../utils/errors/app-error');

class crudRepository {
    constructor(model){
        this.model = model; 
    }

   async create(data){
        try {
            const response = await this.model.create(data);
            return response;
        } catch (error) {
            Logger.error("something went wrong in the crud Repo: create");
            throw error;
        }
    }

    async destroy(data){
        try {
            const response = await this.model.destroy({ 
                where: {
                id: data
            }
            });
            if(!response){
                  throw new AppError("Not able to find the resource",StatusCodes.NOT_FOUND)
            }
            return response;
        } catch (error) {
            Logger.error("something went wrong in the crud Repo: destroy");
            throw error;
        }
    }

    async get(data){
         try {
            const response = await this.model.findByPk(data);
             if(!response){
                throw new AppError("Not able to find the resource",StatusCodes.NOT_FOUND)
            }
            return response;
        } catch (error) {
            Logger.error("something went wrong in the crud Repo: get");
            throw error;
        }
    }

     async getAll(){
         try {
            const response = await this.model.findAll();
            return response;
        } catch (error) {
            Logger.error("something went wrong in the crud Repo: getAll");
            throw error;
        }
    }

    async update(id, data){
         try {
            const response = await this.model.update(data, {
                where:{
                    id:id
                }
            });
            if(response[0] == 0){
                 throw new AppError("Your airplane mode is not present in database",StatusCodes.NOT_FOUND)
            }
            console.log("crud response",response);
            return response;
        } catch (error) {
            Logger.error("something went wrong in the crud Repo: update");
            throw error;
        }
    }

}

module.exports = crudRepository;