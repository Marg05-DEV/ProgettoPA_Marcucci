/*
    Interfaccia che definisce i metodi che le classi DAO devono implementare.
    In particolare sono definite le operazioni CRUD (Create, Read, Update, Delete) per la gestione dei dati.
*/

export interface IDao<T>{
    create(item: T): Promise<T>;
    read(id: number): Promise<T | null>;
    readAll(): Promise<T[]>; 
    update(itemId: number, newData?: Partial<T>): Promise<T | null>;
    // delete(itemId: number): Promise<boolean>;
}