import { AppErrorNames, AppSuccessNames } from "../enums/responseStatus/AppStatusNames";
import { AppErrorMessages, AppSuccessMessages } from "../enums/responseStatus/AppStatusMessages";
import { StatusCodes } from "http-status-codes";

/*
    Interfaccia che definisce la struttura di ciascun messaggio di risposta ad una richiesta (sia d'errore che di successo) che è quindi descritto
    da un name: string, un message: string e lo statusCode: number
*/
export interface StatusStructure {
    name: string;
    message: string;
    statusCode: number;
}

/*
    Mappa che associa ad ogni name degli errori (key) un oggetto (value) che rispetta il contratto definito 
    dall'interfaccia StatusStructure. In questo modo, grazie al nome, è possibile recuperare
    tutte le informazioni relative ad un determinato errore.
*/
export const errorsMap: Record<string, StatusStructure> = {
    [AppErrorNames.INTERNAL_ERROR]: {
        name: AppErrorNames.INTERNAL_ERROR,
        message: AppErrorMessages.INTERNAL_ERROR,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR 
    },
    [AppErrorNames.INVALID_JWT]: {
        name: AppErrorNames.INVALID_JWT,
        message: AppErrorMessages.INVALID_JWT,
        statusCode: StatusCodes.UNAUTHORIZED
    },
    [AppErrorNames.EMAIL_NOT_EXIST]: {
        name: AppErrorNames.EMAIL_NOT_EXIST,
        message: AppErrorMessages.EMAIL_NOT_EXIST,
        statusCode: StatusCodes.UNAUTHORIZED
    },
    [AppErrorNames.UNCORRECT_PASSWORD]: {
        name: AppErrorNames.UNCORRECT_PASSWORD,
        message: AppErrorMessages.UNCORRECT_PASSWORD,
        statusCode: StatusCodes.UNAUTHORIZED
    },
    [AppErrorNames.INVALID_EMAIL]: {
        name: AppErrorNames.INVALID_EMAIL,
        message: AppErrorMessages.INVALID_EMAIL,
        statusCode: StatusCodes.BAD_REQUEST
    },
    [AppErrorNames.INVALID_PASSWORD]: {
        name: AppErrorNames.INVALID_PASSWORD,
        message: AppErrorMessages.INVALID_PASSWORD,
        statusCode: StatusCodes.BAD_REQUEST
    },
    [AppErrorNames.INVALID_USERNAME]: {
        name: AppErrorNames.INVALID_USERNAME,
        message: AppErrorMessages.INVALID_USERNAME,
        statusCode: StatusCodes.BAD_REQUEST
    },
    [AppErrorNames.EMAIL_ALREADY_EXISTS]: {
        name: AppErrorNames.EMAIL_ALREADY_EXISTS,
        message: AppErrorMessages.EMAIL_ALREADY_EXISTS,
        statusCode: StatusCodes.CONFLICT
    },
    [AppErrorNames.USERNAME_ALREADY_EXISTS]: {
        name: AppErrorNames.USERNAME_ALREADY_EXISTS,
        message: AppErrorMessages.USERNAME_ALREADY_EXISTS,
        statusCode: StatusCodes.CONFLICT
    },
    [AppErrorNames.JWT_SECRET_MISSING]: {
        name: AppErrorNames.JWT_SECRET_MISSING,
        message: AppErrorMessages.JWT_SECRET_MISSING,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR
    },
    [AppErrorNames.JWT_PUBLIC_MISSING]: {
        name: AppErrorNames.JWT_PUBLIC_MISSING,
        message: AppErrorMessages.JWT_PUBLIC_MISSING,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR
    },
    [AppErrorNames.JWT_NOT_PROVIDED]: {
        name: AppErrorNames.JWT_NOT_PROVIDED,
        message: AppErrorMessages.JWT_NOT_PROVIDED,
        statusCode: StatusCodes.UNAUTHORIZED
    },
    [AppErrorNames.NOT_OWNER_OR_ADMIN]: {
        name: AppErrorNames.NOT_OWNER_OR_ADMIN,
        message: AppErrorMessages.NOT_OWNER_OR_ADMIN,
        statusCode: StatusCodes.FORBIDDEN
    },  
    [AppErrorNames.USER_NOT_FOUND]: {
        name: AppErrorNames.USER_NOT_FOUND,
        message: AppErrorMessages.USER_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND
    },
    [AppErrorNames.NOT_ADMIN]: {
        name: AppErrorNames.NOT_ADMIN,
        message: AppErrorMessages.NOT_ADMIN,
        statusCode: StatusCodes.FORBIDDEN
    },
    [AppErrorNames.INVALID_TOKEN_AMOUNT]: {
        name: AppErrorNames.INVALID_TOKEN_AMOUNT,
        message: AppErrorMessages.INVALID_TOKEN_AMOUNT,
        statusCode: StatusCodes.BAD_REQUEST
    },
    [AppErrorNames.UPDATE_NOT_FOUND]: {
        name: AppErrorNames.UPDATE_NOT_FOUND,
        message: AppErrorMessages.UPDATE_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND
    },
    [AppErrorNames.INVALID_STATUS]: {
        name: AppErrorNames.INVALID_STATUS,
        message: AppErrorMessages.INVALID_STATUS,
        statusCode: StatusCodes.BAD_REQUEST
    },
    [AppErrorNames.UPDATE_NOT_PENDING]: {
        name: AppErrorNames.UPDATE_NOT_PENDING,
        message: AppErrorMessages.UPDATE_NOT_PENDING,
        statusCode: StatusCodes.BAD_REQUEST
    },
    [AppErrorNames.INVALID_ROLE]: {
        name: AppErrorNames.INVALID_ROLE,
        message: AppErrorMessages.INVALID_ROLE,
        statusCode: StatusCodes.BAD_REQUEST
    },
    [AppErrorNames.ADMIN_SELF_ROLE_CHANGE]: {
        name: AppErrorNames.ADMIN_SELF_ROLE_CHANGE,
        message: AppErrorMessages.ADMIN_SELF_ROLE_CHANGE,
        statusCode: StatusCodes.FORBIDDEN
    },
    [AppErrorNames.INVALID_ID]: {
        name: AppErrorNames.INVALID_ID,
        message: AppErrorMessages.INVALID_ID,
        statusCode: StatusCodes.BAD_REQUEST
    },
    [AppErrorNames.INVALID_GRAPH_NAME]: {
        name: AppErrorNames.INVALID_GRAPH_NAME,
        message: AppErrorMessages.INVALID_GRAPH_NAME,
        statusCode: StatusCodes.BAD_REQUEST
    },
    [AppErrorNames.INVALID_GRAPH_DESCRIPTION]: {
        name: AppErrorNames.INVALID_GRAPH_DESCRIPTION,
        message: AppErrorMessages.INVALID_GRAPH_DESCRIPTION,
        statusCode: StatusCodes.BAD_REQUEST
    },
    [AppErrorNames.INVALID_NODES_DATA]: {
        name: AppErrorNames.INVALID_NODES_DATA,
        message: AppErrorMessages.INVALID_NODES_DATA,
        statusCode: StatusCodes.BAD_REQUEST
    },
    [AppErrorNames.INVALID_NODES_FORMAT]: {
        name: AppErrorNames.INVALID_NODES_FORMAT,
        message: AppErrorMessages.INVALID_NODES_FORMAT,
        statusCode: StatusCodes.BAD_REQUEST
    },
    [AppErrorNames.INVALID_EDGES_DATA]: {
        name: AppErrorNames.INVALID_EDGES_DATA,
        message: AppErrorMessages.INVALID_EDGES_DATA,
        statusCode: StatusCodes.BAD_REQUEST
    },
    [AppErrorNames.INVALID_EDGES_FORMAT]: {
        name: AppErrorNames.INVALID_EDGES_FORMAT,
        message: AppErrorMessages.INVALID_EDGES_FORMAT,
        statusCode: StatusCodes.BAD_REQUEST
    },
    [AppErrorNames.EDGE_NODE_NOT_FOUND]: {
        name: AppErrorNames.EDGE_NODE_NOT_FOUND,
        message: AppErrorMessages.EDGE_NODE_NOT_FOUND,
        statusCode: StatusCodes.BAD_REQUEST
    },
    [AppErrorNames.GRAPH_NOT_CONNECTED]: {
        name: AppErrorNames.GRAPH_NOT_CONNECTED,
        message: AppErrorMessages.GRAPH_NOT_CONNECTED,
        statusCode: StatusCodes.BAD_REQUEST
    },
    [AppErrorNames.INVALID_RUN_NODES]: {
        name: AppErrorNames.INVALID_RUN_NODES,
        message: AppErrorMessages.INVALID_RUN_NODES,
        statusCode: StatusCodes.BAD_REQUEST
    },
    [AppErrorNames.INVALID_DATE_FORMAT]: {
        name: AppErrorNames.INVALID_DATE_FORMAT,
        message: AppErrorMessages.INVALID_DATE_FORMAT,
        statusCode: StatusCodes.BAD_REQUEST
    },
    [AppErrorNames.INVALID_FORMAT_TYPE]: {
        name: AppErrorNames.INVALID_FORMAT_TYPE,
        message: AppErrorMessages.INVALID_FORMAT_TYPE,
        statusCode: StatusCodes.BAD_REQUEST
    },
    [AppErrorNames.EDGE_NOT_FOUND]: {
        name: AppErrorNames.EDGE_NOT_FOUND,
        message: AppErrorMessages.EDGE_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND
    },
    [AppErrorNames.GRAPH_NOT_FOUND]: {
        name: AppErrorNames.GRAPH_NOT_FOUND,
        message: AppErrorMessages.GRAPH_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND
    },
    [AppErrorNames.INSUFFICIENT_TOKENS]: {
        name: AppErrorNames.INSUFFICIENT_TOKENS,
        message: AppErrorMessages.INSUFFICIENT_TOKENS,
        statusCode: StatusCodes.PAYMENT_REQUIRED
    },
    [AppErrorNames.DUPLICATE_UPDATE_REQUEST]: {
        name: AppErrorNames.DUPLICATE_UPDATE_REQUEST,
        message: AppErrorMessages.DUPLICATE_UPDATE_REQUEST,
        statusCode: StatusCodes.CONFLICT
    },
    [AppErrorNames.EDGE_NOT_IN_GRAPH]: {
        name: AppErrorNames.EDGE_NOT_IN_GRAPH,
        message: AppErrorMessages.EDGE_NOT_IN_GRAPH,
        statusCode: StatusCodes.NOT_FOUND
    },
    [AppErrorNames.PENDING_REQUEST_EXISTS]: {
        name: AppErrorNames.PENDING_REQUEST_EXISTS,
        message: AppErrorMessages.PENDING_REQUEST_EXISTS,
        statusCode: StatusCodes.CONFLICT
    }
}

/*
    Mappa che associa ad ogni name di una risposta con successo (key) un oggetto (value) che rispetta il contratto definito 
    dall'interfaccia StatusStructure. In questo modo, grazie al nome, è possibile recuperare
    tutte le informazioni relative ad un determinato messaggio di successo.
*/
export const successesMap: Record<string, StatusStructure> = {
    [AppSuccessNames.USER_LOGGED_IN]: {
    name: AppSuccessNames.USER_LOGGED_IN,
    message: AppSuccessMessages.USER_LOGGED_IN,
    statusCode: StatusCodes.OK
    },
    [AppSuccessNames.USER_REGISTERED]: {
        name: AppSuccessNames.USER_REGISTERED,
        message: AppSuccessMessages.USER_REGISTERED,
        statusCode: StatusCodes.CREATED
    },
    [AppSuccessNames.USER_FOUND]: {
        name: AppSuccessNames.USER_FOUND,
        message: AppSuccessMessages.USER_FOUND,
        statusCode: StatusCodes.OK
    },
    [AppSuccessNames.TOKENS_RECHARGED]: {
        name: AppSuccessNames.TOKENS_RECHARGED,
        message: AppSuccessMessages.TOKENS_RECHARGED,
        statusCode: StatusCodes.OK
    },
    [AppSuccessNames.PENDING_UPDATE_RESOLVED]: {
        name: AppSuccessNames.PENDING_UPDATE_RESOLVED,
        message: AppSuccessMessages.PENDING_UPDATE_RESOLVED,
        statusCode: StatusCodes.OK
    },
    [AppSuccessNames.ROLE_UPDATED]: {
        name: AppSuccessNames.ROLE_UPDATED,
        message: AppSuccessMessages.ROLE_UPDATED,
        statusCode: StatusCodes.OK
    },
    [AppSuccessNames.PENDING_REQUESTS_FOUND]: { 
        name: AppSuccessNames.PENDING_REQUESTS_FOUND,
        message: AppSuccessMessages.PENDING_REQUESTS_FOUND,
        statusCode: StatusCodes.OK
    },
    [AppSuccessNames.GRAPHS_FOUND]: {
        name: AppSuccessNames.GRAPHS_FOUND,
        message: AppSuccessMessages.GRAPHS_FOUND,
        statusCode: StatusCodes.OK
    },
    [AppSuccessNames.GRAPH_CREATED]: {
        name: AppSuccessNames.GRAPH_CREATED,
        message: AppSuccessMessages.GRAPH_CREATED,
        statusCode: StatusCodes.CREATED
    },
    [AppSuccessNames.GRAPH_FOUND]: {
        name: AppSuccessNames.GRAPH_FOUND,
        message: AppSuccessMessages.GRAPH_FOUND,
        statusCode: StatusCodes.OK
    },
    [AppSuccessNames.SHORTEST_PATH_COMPUTED]: {
        name: AppSuccessNames.SHORTEST_PATH_COMPUTED,
        message: AppSuccessMessages.SHORTEST_PATH_COMPUTED,
        statusCode: StatusCodes.OK
    },
    [AppSuccessNames.GRAPH_EDGES_UPDATED]: {
        name: AppSuccessNames.GRAPH_EDGES_UPDATED,
        message: AppSuccessMessages.GRAPH_EDGES_UPDATED,
        statusCode: StatusCodes.OK
    },
    [AppSuccessNames.GRAPH_LOGS_FOUND]: {
        name: AppSuccessNames.GRAPH_LOGS_FOUND,
        message: AppSuccessMessages.GRAPH_LOGS_FOUND,
        statusCode: StatusCodes.OK
    }
}