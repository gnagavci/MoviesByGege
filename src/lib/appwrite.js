import { Client, Databases, Query, ID} from 'appwrite';

const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;


const client = new Client();

client.setEndpoint(ENDPOINT).setProject(PROJECT_ID); // Replace with your project ID

// export const account = new Account(client);
// export { ID } from 'appwrite';

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
// 1. Check if row already exists in the database (movie has been searched before) 
   try{ 
    const result = await database.listDocuments(DATABASE_ID, TABLE_ID, [Query.equal("searchTerm", searchTerm) ])

    // 2. if it does update the count
    if(result.documents.length > 0){
        const doc = result.documents[0];

        await database.updateDocument(DATABASE_ID, TABLE_ID, doc.$id, { count: doc.count + 1 })
    }
    else{

        // 3. if it doesn't create a new row with the search Term and count as 1
        await database.createDocument(DATABASE_ID, TABLE_ID, ID.unique(), {
            searchTerm: searchTerm,
            count: 1,
            poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
            movie_id: movie.id,

        })


    }

    }
    catch(error){
        console.error(error);
    }










}

export const getTrendingMovies = async () => {

    try {
        
        const result = await database.listDocuments(DATABASE_ID, TABLE_ID, [
            Query.limit(5),
            Query.orderDesc("count")
        ])

        return result.documents;
    } catch (error) {
        console.error(error);
    }
}