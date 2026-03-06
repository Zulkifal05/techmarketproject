import mongoose from "mongoose"

type ConnectDBOptions = {
  isConnected?: boolean
}

const dbConnection: ConnectDBOptions = {
  isConnected: false,
}

export const connectDB = async () => {
  if (dbConnection.isConnected) {
    return
  }

  try {
    const connection = await mongoose.connect(process.env.NEXT_MONGODB_URI || "", {
    })
    
    if(connection?.connections[0].readyState === 1) {
      dbConnection.isConnected = true;
    }

  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
}