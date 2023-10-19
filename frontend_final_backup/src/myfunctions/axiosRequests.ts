import axios, { type AxiosResponse } from "axios";

const apiAddress = "http://157.230.24.1:8080/api/";




/**
 * getConfigurationAPI calls the REST Api to fetch the configuration for the
 * simulator.
 * @returns The currently stored configuration.
 */
export async function getConfigurationAPI(): Promise<any> {
    try {
        const response = await axios.get(apiAddress + "configuration")
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        return error as Error;
    }
}

/**
 * saveConfigurationAPI calls the REST Api to update the configuration for the
 * simulator.
 * @returns Null or an error.
 */
export async function saveConfigurationAPI(configuration: any): Promise<any> {
    try {
        const response = await axios.put(apiAddress + "configuration", configuration);
        console.log(response.data);
        return response.data;

    } catch (error) {
        console.error(error);
        return error as Error;
    }
}



interface Location {
    // Define the properties of your location object here
    // For example:
    latitude: number;
    longitude: number;
    timestamp: number;
}

/**
 * getLocationsAPI calls the REST Api to fetch the simulated locations between
 * two points in time.
 * @param start UNIX timestamp
 * @param end UNIX timestamp
 * @returns The locations.
 */
export async function getLocationsAPI(start = 0, end = Number.MAX_SAFE_INTEGER): Promise<Location[] | Error> {
    try {
        const response: AxiosResponse<Location[]> = await axios.get(apiAddress + `locations?start=${start}&end=${end}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        return error as Error;
    }
}




/**
 * startLearningAPI calls the REST Api to start the Scenario-Learning.
 * @returns Null or an error.
 */
export async function startLearningAPI(): Promise<null | Error> {
    try {
        const response: AxiosResponse<null> = await axios.post(apiAddress + 'learning/start');
        console.log(response.data);
        return response.data;

    } catch (error) {
        console.log("error");
        return error as Error;
    }
};

/**
 * getStatusLearningAPI calls the REST Api to fetch the Scenario-Learning
 * status.
 * @returns The Scenario-Learning status.
 */
export async function getStatusLearningAPI(): Promise<string | Error> {
    try {
        const response: AxiosResponse<string> = await axios.get(apiAddress + 'learning/status');
        console.log(response.data);
        return response.data;

    } catch (error) {
        console.log("error");
        return error as Error;
    }
};

/**
 * startGenerationAPI calls the REST Api to start the Scenario-Generation.
 * @returns Null or an error.
 */
export async function startGenerationAPI (): Promise<null | Error>  {
    try {
        const response: AxiosResponse<null> = await axios.post(apiAddress + 'generation/start');
        console.log(response.data);
        return response.data;

    } catch (error) {
        console.log("error");
        return error as Error;
    }
};

/**
 * getStatusGenerationAPI calls the REST Api to fetch the Scenario-Generation
 * status.
 * @returns The Scenario-Generation status.
 */
export async function getStatusGenerationAPI (): Promise<string | Error>  {
    try {
        const response: AxiosResponse<string> = await axios.get(apiAddress + 'generation/status');
        console.log(response.data);
        return response.data;

    } catch (error) {
        console.log("error");
        return error as Error;
    }
};

/**
 * persistGenerationResultAPI calls the REST Api to persist the
 * Scenario-Learning result.
 * @returns Null or an error.
 */
export async function persistGenerationResultAPI (): Promise<null | Error>  {
    try {
        const response: AxiosResponse<null> = await axios.post(apiAddress + 'generation/persist');
        console.log(response.data);
        return response.data;

    } catch (error) {
        console.log("error");
        return error as Error;
    }

};