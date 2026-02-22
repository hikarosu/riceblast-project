    import mongoose from "mongoose";

    async function connectionInstance(){
        try{
        const connected = await mongoose.connect(process.env.MONGODB_URI);
        if(connected){
            console.log("connected to the database")
        }
        }
        catch(error)
        {
        console.log(error);  
        }
    }

    export default connectionInstance