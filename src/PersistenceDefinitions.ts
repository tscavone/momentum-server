import { IDataUser } from './shared/data_definitions/AuthedUserDefinitions'

export enum UserStatus {
    needsInit,
    initialized,
    error,
}

export interface IPersistenceUser extends IDataUser {
    status: UserStatus
}
